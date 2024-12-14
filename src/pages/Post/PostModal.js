import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import './PostModal.css'; // PostModal.css 파일 import

const PostModal = ({
    show,
    handleClose,
    handleSubmit,
    title,
    setTitle,
    editorData,
    setEditorData,
    hashtags,
    setHashtags,
    isEditMode = false,
    isNotice = false, // 공지사항 모드 추가
}) => {
    const [pendingUploads, setPendingUploads] = useState([]); // 업로드 대기 이미지 파일 리스트
    const { showToast } = useToast();

    useEffect(() => {
        if (isEditMode && show) {
        }
    }, [isEditMode, show]);

    // CKEditor에 이미지 업로드 핸들러 설정 (저장만 하고 즉시 업로드는 안함)
    const customUploadAdapter = (loader) => {
        return {
            upload: () => {
                return new Promise((resolve, reject) => {
                    loader.file.then((file) => {
                        // 이미지 파일을 상태에 저장
                        setPendingUploads((prevUploads) => [...prevUploads, file]);
                        // 에디터에 임시 URL 설정 (로컬 미리보기)
                        const tempUrl = URL.createObjectURL(file);
                        resolve({ default: tempUrl });
                    });
                });
            },
        };
    };

    // CKEditor 플러그인 설정: 업로드 어댑터 등록
    function uploadPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) =>
            customUploadAdapter(loader);
    }

    const handleFinalSubmit = async () => {
        try {
            // S3에 대기 중인 이미지를 업로드
            const uploadedUrls = await Promise.all(
                pendingUploads.map(async (file) => {
                    const formData = new FormData();
                    formData.append('path', 'post/images'); // 경로 추가
                    formData.append('file', file); // 'upload'에서 'file'로 변경

                    const token = localStorage.getItem("access_token");
                    const response = await axios.post('http://localhost:8080/api/s3', formData, { // '/upload' 제거
                        headers: { 'Content-Type': 'multipart/form-data' },
                        access: token,
                    });
                    return response.data.url;
                })
            );
            // 에디터 데이터에서 임시 URL(blob)을 S3 URL로 대체
            let updatedEditorData = editorData;
    
            const parser = new DOMParser();
            const doc = parser.parseFromString(editorData, 'text/html');
            const images = doc.querySelectorAll('img');
    
            images.forEach((img, index) => {
                const blobUrl = img.getAttribute('src');
                if (blobUrl.startsWith('blob:')) {
                    const s3Url = uploadedUrls[index];
                    updatedEditorData = updatedEditorData.replace(blobUrl, s3Url); // blob -> S3 URL 대체
                }
            });
    
            // 게시글 데이터와 업로드된 이미지 URL을 함께 제출
            await handleSubmit({
                title,
                content: updatedEditorData,
                hashtags: isNotice ? ["공지사항"] : hashtags.split(',').map((tag) => tag.trim()), // 해시태그 배열
                postType: isNotice ? 'NOTICE' : 'POST', // 공지사항 모드 여부에 따라 PostType 결정
            });
    
            // 초기화
            /*
            setPendingUploads([]);
            setEditorData('');
            setTitle('');
            setHashtags('');
            */
        } catch (error) {
            console.error('게시글 등록 중 오류 발생:', error);
            showToast('게시글 등록에 실패했습니다', 'error');
        }
    };
    
    return (
        <Modal className="post-modal" show={show} onHide={handleClose} centered>
            <Modal.Header className="post-modal-header" closeButton>
                <Modal.Title className="post-modal-title">
                    {isNotice ? (isEditMode ? '공지사항 수정' : '공지사항 작성') : isEditMode ? '글 수정' : '글 쓰기'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="post-modal-body">
                <Form>
                    {/* 제목 입력 */}
                    <Form.Group className="mb-3 post-modal-title-group">
                        <Form.Label className="post-modal-label">제목</Form.Label>
                        <Form.Control
                            type="text"
                            className="post-modal-title-input"
                            placeholder="제목을 입력해주세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    {/* 본문 입력 */}
                    <Form.Group className="mb-3 post-modal-content-group">
                        <Form.Label className="post-modal-label">본문</Form.Label>
                        <CKEditor
                            editor={ClassicEditor}
                            config={{
                                extraPlugins: [uploadPlugin], // 이미지 업로드 플러그인 추가
                            }}
                            data={editorData}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setEditorData(data);
                            }}
                            className="post-modal-editor"
                        />
                    </Form.Group>
                                
                    {/* 해시태그 입력 */}
                    {!isNotice && (
                    <Form.Group className="mb-3 post-modal-hashtags-group">
                        <Form.Label className="post-modal-label">해시태그</Form.Label>
                        <Form.Control
                            type="text"
                            className="post-modal-hashtags-input"
                            placeholder="해시태그를 입력해주세요 (쉼표로 구분)"
                            value={hashtags}
                            onChange={(e) => setHashtags(e.target.value)}
                        />
                    </Form.Group>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer className="post-modal-footer">
                {/* 취소 버튼 */}
                <Button variant="secondary" className="post-modal-cancel" onClick={handleClose}>
                    취소
                </Button>

                {/* 등록 또는 수정 버튼 */}
                <Button variant="primary" className="post-modal-submit" onClick={handleFinalSubmit}>
                    {isEditMode ? '수정' : '등록'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PostModal;

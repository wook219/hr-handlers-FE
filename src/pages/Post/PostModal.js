import React, { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
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
}) => {
    // 수정 모드일 때 데이터를 초기화하거나 로그 출력
    useEffect(() => {
        if (isEditMode && show) {
            console.log('Editing mode active, pre-filling data for editing');
        }
    }, [isEditMode, show]);

    // CKEditor에 이미지 업로드 핸들러 설정
    const customUploadAdapter = (loader) => {
        return {
            upload: () => {
                return new Promise((resolve, reject) => {
                    loader.file.then((file) => {
                        const formData = new FormData();
                        formData.append('upload', file);

                        // S3 업로드 API 호출
                        axios
                            .post('/api/s3/upload', formData, {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            })
                            .then((response) => {
                                resolve({ default: response.data.url }); // S3 URL 반환
                            })
                            .catch((error) => {
                                console.error('Image upload failed:', error);
                                reject(error);
                            });
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

    return (
        <Modal className="post-modal" show={show} onHide={handleClose} centered>
            <Modal.Header className="post-modal-header" closeButton>
                <Modal.Title className="post-modal-title">
                    {isEditMode ? '글 수정' : '글 쓰기'}
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
                </Form>
            </Modal.Body>
            <Modal.Footer className="post-modal-footer">
                {/* 취소 버튼 */}
                <Button variant="secondary" className="post-modal-cancel" onClick={handleClose}>
                    취소
                </Button>

                {/* 등록 또는 수정 버튼 */}
                <Button variant="primary" className="post-modal-submit" onClick={handleSubmit}>
                    {isEditMode ? '수정' : '등록'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PostModal;

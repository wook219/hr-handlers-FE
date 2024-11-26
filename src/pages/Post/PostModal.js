import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './PostModal.css'; // PostModal.css 파일 import

const PostModal = ({ show, handleClose, handleSubmit, title, setTitle, editorData, setEditorData, hashtags, setHashtags }) => {
    return (
        <Modal className="post-modal" show={show} onHide={handleClose} centered>
            <Modal.Header className="post-modal-header" closeButton>
                <Modal.Title className="post-modal-title">글쓰기</Modal.Title>
            </Modal.Header>
            <Modal.Body className="post-modal-body">
                <Form>
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
                    <Form.Group className="mb-3 post-modal-content-group">
                        <Form.Label className="post-modal-label">본문</Form.Label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={editorData}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setEditorData(data);
                            }}
                            className="post-modal-editor"
                        />
                    </Form.Group>
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
                <Button variant="secondary" className="post-modal-cancel" onClick={handleClose}>
                    취소
                </Button>
                <Button variant="primary" className="post-modal-submit" onClick={handleSubmit}>
                    등록
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PostModal;

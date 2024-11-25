import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './PostModal.css'; // PostModal.css 파일 import

const PostModal = ({ show, handleClose, handleSubmit, title, setTitle, editorData, setEditorData, hashtags, setHashtags }) => {
    return (
        <Modal className="custom-modal" show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>글쓰기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>제목</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="제목을 입력해주세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>본문</Form.Label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={editorData}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setEditorData(data);
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>해시태그</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="해시태그를 입력해주세요 (쉼표로 구분)"
                            value={hashtags}
                            onChange={(e) => setHashtags(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    취소
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    등록
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PostModal;

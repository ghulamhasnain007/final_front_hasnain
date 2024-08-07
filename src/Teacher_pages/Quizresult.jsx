import React, { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Spin, Button, Modal, message } from 'antd';
import axios from 'axios';
import Nav from '../Teachercomp/Tnavi';
import { useParams } from 'react-router-dom';
import url from '../api/api.js';

const QuizResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);
    const { id } = useParams();
    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/quiz/${id}`);
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching quiz results:', error);
            message.error('Failed to fetch quiz results');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []); 


    const handleDelete = async () => {
        if (!selectedResult) return;
        setDeleteModalVisible(false);
        try {
            await axios.delete(`${url}/result/result_delete/${selectedResult._id}`);
            message.success('Quiz result deleted successfully!');
            fetchResults(); // Refresh results after deletion
        } catch (error) {
            console.error('Error deleting quiz result:', error);
            message.error('Failed to delete quiz result');
        }
    };

    const showDeleteModal = (result) => {
        setSelectedResult(result);
        setDeleteModalVisible(true);
    };

    const hideDeleteModal = () => {
        setSelectedResult(null);
        setDeleteModalVisible(false);
    };

    const columns = [
        {
            title: 'Student Name',
            dataIndex: 'student_name',
            key: 'student_name',
            width: '25%',
        },
        {
            title: 'Quiz',
            dataIndex: 'quizName',
            key: 'quizName',
            width: '30%',
        },
        {
            title: 'Created Date',
            dataIndex: 'date',
            key: 'date',
            width: '20%',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            width: '15%',
            render: (score, record) => {
                const passingPoint = record.passing_point;
                return (
                    <span style={{ color: score >= passingPoint ? 'green' : 'red' }}>
                        {score}
                    </span>
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (text, record) => (
                <Button type="link" onClick={() => showDeleteModal(record)}>Delete</Button>
            ),
        },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '30px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <Nav /> <br /><br /><br /><br /><br />
            <center>
                <h2>Student Quiz result</h2>
            </center>
            <div style={{ padding: '20px' }}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Card title="Quiz Results">
                            <Table
                                dataSource={results}
                                columns={columns}
                                pagination={{ pageSize: 10 }}
                                scroll={{ x: 'max-content' }} 
                                size="middle"
                                bordered
                                rowKey="_id"
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Delete Modal */}
                <Modal
                    title="Delete Quiz Result"
                    open={deleteModalVisible}
                    onOk={handleDelete}
                    onCancel={hideDeleteModal}
                    okText="Delete"
                    cancelText="Cancel"
                >
                    <p>Are you sure you want to delete this quiz result?</p>
                </Modal>
            </div>
        </>
    );
};

export default QuizResults;

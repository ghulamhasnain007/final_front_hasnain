import React, { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Spin, Button, Modal, message } from 'antd';
import axios from 'axios';
import Nav from '../Teachercomp/Tnavi';
import { useParams } from 'react-router-dom';

let url = 'http://localhost:3000/api';

const QuizResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await axios.get(`${url}/quiz/${id}`);
            // console.log('Quiz results fetched:', response.data); // Debugging
            setResults(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quiz results:', error);
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedResult) return;

        try {
            await axios.delete(`${url}/result/result_delete/${selectedResult._id}`);
            // console.log('Quiz result deleted:', selectedResult._id); // Debugging
            setDeleteModalVisible(false);
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
            width: '20%',
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
            width: '10%',
            render: (score, record) => {
                const passingPoint = record.passing_point; // Assuming passing_point is part of each record
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
            width: '20%',
            render: (text, record) => (
                <Button type="link" onClick={() => showDeleteModal(record)}>Delete</Button>
            ),
        },
    ];

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <>
            <Nav />
            <br /><br /><br /><br /><br /><br /><br />
            <div>
                <center>
                    <h1>Student Result</h1>
                </center>
                <Row gutter={16}>
                    <Col span={24}>
                        <Card title="Quiz Results">
                            <Table
                                dataSource={results}
                                columns={columns}
                                pagination={{ pageSize: 10 }}
                                scroll={{ y: 240 }}
                                size="middle"
                                bordered
                                rowKey="_id" // Assigning _id as the unique key for each row
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Delete Modal */}
                <Modal
                    title={`Delete Quiz Result`}
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

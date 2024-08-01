import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button, Card, Spin, Alert, Input, InputNumber, Form, Row, Col, message } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { VscOutput } from 'react-icons/vsc';

const { Meta } = Card;
const { TextArea } = Input;

const CodeExecutionComponent = () => {
    const [submissionData, setSubmissionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [consoleLogs, setConsoleLogs] = useState([]);
    const [numberInput, setNumberInput] = useState(0);
    const [messagee, setMessagee] = useState('');
    const [submission, setSubmission] = useState({});
    const { task_id, student_id } = useParams();
    const url = 'http://localhost:3000/api';

    const fetchAndRunCode = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/tasksubmit/code/${task_id}/${student_id}`);
            const files = response.data.submission.files;
            setSubmissionData(files);
            setSubmission(response.data.submission);
        } catch (error) {
            setError(error.message);
            console.error('Failed to fetch submission data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndRunCode();
    }, [task_id, student_id]);

    const handleAddPoint = () => {
        console.log(messagee, numberInput);
        axios.put(`${url}/createtask/point/${submission._id}`, { point: numberInput, message: messagee })
            .then(response => {
                message.success('Point updated successfully');
            })
            .catch(error => {
                console.log('Error updating point:', error);
                message.error('Failed to update point');
            });
    };

    const generateIframeContent = () => {
        if (!submissionData) return '';

        let htmlContent = '';
        let cssContent = '';
        let jsContent = '';

        submissionData.forEach(file => {
            if (file.originalname.endsWith('.html')) {
                htmlContent += file.code;
            } else if (file.originalname.endsWith('.css')) {
                cssContent += file.code;
            } else if (file.originalname.endsWith('.js')) {
                jsContent += file.code;
            }
        });

        const showAlertFunction = `
            function showAlert() {
                alert('Alert from injected code!');
            }
        `;

        return `
            <html>
                <head>
                    <style>${cssContent}</style>
                </head>
                <body>
                    ${htmlContent}
                    <script>
                        ${showAlertFunction}

                        var console = (function(oldCons){
                            return {
                                log: function(text){
                                    oldCons.log(text);
                                    window.parent.postMessage({log: text}, "*");
                                },
                                info: function (text) {
                                    oldCons.info(text);
                                    window.parent.postMessage({log: text}, "*");
                                },
                                warn: function (text) {
                                    oldCons.warn(text);
                                    window.parent.postMessage({log: text}, "*");
                                },
                                error: function (text) {
                                    oldCons.error(text);
                                    window.parent.postMessage({log: text}, "*");
                                }
                            };
                        }(window.console));

                        window.console = console;

                        ${jsContent}
                    </script>
                </body>
            </html>
        `;
    };

    useEffect(() => {
        const handleConsoleLogs = (event) => {
            if (event.data.log !== undefined) {
                setConsoleLogs((prevLogs) => [...prevLogs, event.data.log]);
            }
        };

        window.addEventListener('message', handleConsoleLogs);
        return () => window.removeEventListener('message', handleConsoleLogs);
    }, []);

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#e8f5e9' }}>
            {error && <Alert type="error" message={`Code execution error: ${error}`} showIcon />}
            {submissionData && (
                <Card
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Submitted Code</span>
                            <Button onClick={fetchAndRunCode} type='primary' style={{ marginLeft: 'auto' }}>Refresh</Button>
                        </div>
                    }
                    style={{ marginTop: '20px', borderColor: '#4caf50', borderRadius: '10px' }}
                >
                    <Meta
                        description={(
                            <div>
                                <Row gutter={16}>
                                    {submissionData.some(file => file.originalname.endsWith('.html')) && (
                                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                                            <Card title="HTML Code" bordered={false} style={{ marginBottom: '20px', borderColor: '#4caf50', borderRadius: '10px' }}>
                                                {submissionData.filter(file => file.originalname.endsWith('.html')).map((file, index) => (
                                                    <Editor
                                                        key={index}
                                                        height="200px"
                                                        language="html"
                                                        value={file.code}
                                                        options={{ readOnly: true }}
                                                    />
                                                ))}
                                            </Card>
                                        </Col>
                                    )}
                                    {submissionData.some(file => file.originalname.endsWith('.css')) && (
                                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                                            <Card title="CSS Code" bordered={false} style={{ marginBottom: '20px', borderColor: '#4caf50', borderRadius: '10px' }}>
                                                {submissionData.filter(file => file.originalname.endsWith('.css')).map((file, index) => (
                                                    <Editor
                                                        key={index}
                                                        height="200px"
                                                        language="css"
                                                        value={file.code}
                                                        options={{ readOnly: true }}
                                                    />
                                                ))}
                                            </Card>
                                        </Col>
                                    )}
                                    {submissionData.some(file => file.originalname.endsWith('.js')) && (
                                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                                            <Card title="JavaScript Code" bordered={false} style={{ marginBottom: '20px', borderColor: '#4caf50', borderRadius: '10px' }}>
                                                {submissionData.filter(file => file.originalname.endsWith('.js')).map((file, index) => (
                                                    <div key={index}>
                                                        <Editor
                                                            height="200px"
                                                            language="javascript"
                                                            value={file.code}
                                                            options={{ readOnly: true }}
                                                        />
                                                    </div>
                                                ))}
                                            </Card>
                                        </Col>
                                    )}
                                </Row>
                                <div style={{ marginTop: '20px' }}>
                                    <h3 style={{ color: '#4caf50' }}>Output <VscOutput /> </h3>
                                    <iframe
                                        title="Code Execution"
                                        srcDoc={generateIframeContent()}
                                        style={{ width: '100%', height: '300px', border: '1px solid #4caf50', borderRadius: '10px' }}
                                        sandbox="allow-scripts allow-same-origin allow-modals"
                                    />
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <h4 style={{ color: '#4caf50' }}>Console</h4>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #4caf50', borderRadius: '10px', padding: '10px' }}>
                                        {consoleLogs.map((log, index) => (
                                            <div key={index} style={{ borderBottom: '1px solid #c8e6c9', padding: '5px 0' }}>{log}</div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <Form>
                                        <h4 style={{ color: '#4caf50' }}>Add Review</h4>
                                        <TextArea
                                            rows={4}
                                            value={submission.message}
                                            onChange={(e) => setMessagee(e.target.value)}
                                            placeholder="Enter review"
                                            style={{ borderRadius: '8px', borderColor: '#4caf50' }}
                                        />
                                        <div style={{ marginTop: '10px', color: '#4caf50' }}>
                                            {messagee && <p><strong>Current Review:</strong> {messagee}</p>}
                                        </div>
                                        <h4 style={{ color: '#4caf50' }}>Enter Points</h4>
                                        <InputNumber
                                      
                                            max={submission.total_points || 0 }
                                            value={submission.point}
                                            onChange={(value) => setNumberInput(value)}
                                            style={{ width: '100%', borderRadius: '8px', borderColor: '#4caf50' }}
                                            placeholder="Enter points"
                                        />
                                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                            <Button 
                                                onClick={handleAddPoint} 
                                                style={{ borderRadius: '8px', backgroundColor: '#4caf50', color: '#fff' }}>
                                                Add Point
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        )}
                    />
                </Card>
            )}
        </div>
    );
};

export default CodeExecutionComponent;

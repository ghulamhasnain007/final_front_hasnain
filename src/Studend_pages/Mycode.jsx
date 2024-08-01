import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button, Card, Spin, Alert, Input, InputNumber, Form, Row, Col, message } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { VscOutput } from 'react-icons/vsc';
import { FaExternalLinkSquareAlt } from "react-icons/fa";
const { Meta } = Card;
const { TextArea } = Input;

const Mycode = () => {
    const [submissionData, setSubmissionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [consoleLogs, setConsoleLogs] = useState([]);
    const [submission, setSubmission] = useState({});
    const { task_id, student_id } = useParams();
    const url = 'http://localhost:3000/api';

    useEffect(() => {
        const fetchAndRunCode = async () => {
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

        fetchAndRunCode();
    }, [task_id, student_id]);

    // const handleAddPoint = () => {
    //     console.log(messagee, numberInput);
    //     axios.put(`${url}/createtask/point/${submission._id}`, { point: numberInput, message: messagee })
    //         .then(response => {
    //             message.success('Point updated successfully');
    //         })
    //         .catch(error => {
    //             console.log('Error updating point:', error);
    //             message.error('Failed to update point');
    //         });
    // };

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
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
            {error && <Alert type="error" message={`Code execution error: ${error}`} showIcon />}
            {submissionData && (
                <Card title="Submitted Code" style={{ marginTop: '20px', borderColor: '#0056b3' }}>
                    <Meta
                        description={(
                            <div>
                                <Row gutter={16}>
                                    {submissionData.some(file => file.originalname.endsWith('.html')) && (
                                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                                            <Card title="HTML Code" bordered={false} style={{ marginBottom: '20px', borderColor: '#0056b3' }}>
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
                                            <Card title="CSS Code" bordered={false} style={{ marginBottom: '20px', borderColor: '#0056b3' }}>
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
                                            <Card title="JavaScript Code" bordered={false} style={{ marginBottom: '20px', borderColor: '#0056b3' }}>
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
                                    <h3 style={{ color: '#0056b3' }}>Output <VscOutput /> </h3>
                                    <iframe
                                        title="Code Execution"
                                        srcDoc={generateIframeContent()}
                                        style={{ width: '100%', height: '300px', border: '1px solid #0056b3' }}
                                        sandbox="allow-scripts allow-same-origin allow-modals"
                                    />
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <h4 style={{ color: '#0056b3' }}>Console</h4>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #0056b3', padding: '10px' }}>
                                        {consoleLogs.map((log, index) => (
                                            <div key={index} style={{ borderBottom: '1px solid #e0e0e0', padding: '5px 0' }}>{log}</div>
                                        ))}
                                    </div>
                                </div>  
                            </div>
                        )}
                    />
                </Card>
            )}
        </div>
    );
};

export default Mycode;

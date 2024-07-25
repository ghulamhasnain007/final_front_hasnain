import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, message,Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Nav from '../Teachercomp/Tnavi';
let url = 'https://saylaniportalback-production.up.railway.app/api'
const QuizForm = () => {
  const [form] = Form.useForm();
  const [quizKey, setQuizKey] = useState('');

  const onFinish = async (values) => {
    // Transform options into an array
    const questions = values.questions.map((question) => ({
      ...question,
      options: [question.option1, question.option2, question.option3, question.option4],
    }));

    const teacherData = JSON.parse(localStorage.getItem('techerdata'));
    const teacherId = teacherData.userData.id;

    const data = {
      quizName: values.quizName,
      quizKey: generateQuizKey(), // Generate unique quiz key
      question_point: values.point,
      passing_point: values.passingPoint,
      teacher_name: teacherData.userData.teacher_name,
      timer: values.timer, // Include the timer value
      active: false,
      teacher_id: teacherId,
      total_point: values.totalPoint, // Include total points from form input
      questions,
    };

    try {
      const response = await axios.post(`${url}/quiz`, data);
      // console.log('Quiz created:', response.data);
      form.resetFields();
      setQuizKey(data.quizKey); // Update state with generated quiz key
      message.success('Quiz created successfully!');
    } catch (error) {
      console.error('There was an error creating the quiz!', error);
      message.error('Failed to create quiz');
    }
  };

  // Function to generate a random quiz key
  const generateQuizKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 6; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  return (
    <>
      <Nav /><br /><br /><br /><br /> <br />
      <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Link to="/teacher/allquiz">
          <Button
            type="default"
            style={{
              marginBottom: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              color: '#1890ff',
              borderColor: '#1890ff',
            }}
          >
            All Quizzes
          </Button>
        </Link>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="quizName"
            label="Quiz Name"
            rules={[{ required: true, message: 'Please enter the quiz name' }]}
          >
            <Input style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
          </Form.Item>
          <Form.Item
            name="timer"
            label="Quiz Timer (minutes)"
            rules={[{ required: true, message: 'Please enter the quiz timer in minutes' }]}
          >
            <Input type="number" style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="point"
                label="Each Question Point"
                rules={[{ required: true, message: 'Please enter the question point' }]}
              >
                <Input style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="passingPoint"
                label="Passing Point"
                rules={[{ required: true, message: 'Please enter the passing point' }]}
              >
                <Input style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="totalPoint"
            label="Total Points"
            rules={[{ required: true, message: 'Please enter the total points' }]}
          >
            <Input style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
          </Form.Item>
  
          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'question']}
                      fieldKey={[fieldKey, 'question']}
                      label={`Question ${name + 1}`}
                      rules={[{ required: true, message: 'Please enter the question' }]}
                    >
                      <Input style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'option1']}
                          fieldKey={[fieldKey, 'option1']}
                          label="Option 1"
                          rules={[{ required: true, message: 'Please enter option 1' }]}
                        >
                          <Input style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'option2']}
                          fieldKey={[fieldKey, 'option2']}
                          label="Option 2"
                          rules={[{ required: true, message: 'Please enter option 2' }]}
                        >
                          <Input style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'option3']}
                          fieldKey={[fieldKey, 'option3']}
                          label="Option 3"
                          rules={[{ required: true, message: 'Please enter option 3' }]}
                        >
                          <Input style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'option4']}
                          fieldKey={[fieldKey, 'option4']}
                          label="Option 4"
                          rules={[{ required: true, message: 'Please enter option 4' }]}
                        >
                          <Input style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      {...restField}
                      name={[name, 'correctAnswer']}
                      fieldKey={[fieldKey, 'correctAnswer']}
                      label="Correct Answer"
                      rules={[{ required: true, message: 'Please enter the correct answer' }]}
                    >
                      <Input style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
                    </Form.Item>
                    <Button type="danger" onClick={() => remove(name)} icon={<MinusCircleOutlined />} style={{ borderRadius: '8px', marginBottom: '10px' }}>
                      Remove Question
                    </Button>
                    <hr />
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ borderRadius: '8px' }}>
                    Add Question
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
  
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ borderRadius: '8px' }}
            >
              Create Quiz
            </Button>
          </Form.Item>
        </Form>
  
       
       
      </div>
    </>
  );
  
};

export default QuizForm;

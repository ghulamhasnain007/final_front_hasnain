import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const QuizForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    // Transform options into an array
    const questions = values.questions.map((question) => ({
      ...question,
      options: [question.option1, question.option2, question.option3, question.option4],
    }));
    let name = JSON.parse(localStorage.getItem('techerdata')).userData.teacher_name
    const data = {
      quizName: values.quizName,
      quizKey: values.quizKey,
      question_point: values.point,
      passing_point: values.passingPoint,
      teacher_name: name ,

      questions,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/quiz', data);
      console.log('Quiz created:', response.data);
      form.resetFields();
    } catch (error) {
      console.error('There was an error creating the quiz!', error);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="quizName"
        label="Quiz Name"
        rules={[{ required: true, message: 'Please enter the quiz name' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="quizKey"
        label="Quiz Key"
        rules={[{ required: true, message: 'Please enter the quiz key' }]}
      >
        <Input />
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="point"
            label="Each Question Point"
            rules={[{ required: true, message: 'Please enter the question point' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="passingPoint"
            label="Passing Point"
            rules={[{ required: true, message: 'Please enter the passing point' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.List name="questions">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <div key={key}>
                <Form.Item
                  {...restField}
                  name={[name, 'question']}
                  fieldKey={[fieldKey, 'question']}
                  label={`Question ${name + 1}`}
                  rules={[{ required: true, message: 'Please enter the question' }]}
                >
                  <Input />
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
                      <Input />
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
                      <Input />
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
                      <Input />
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
                      <Input />
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
                  <Input />
                </Form.Item>
                <Button type="danger" onClick={() => remove(name)} icon={<MinusCircleOutlined />}>
                  Remove Question
                </Button>
                <hr />
              </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Question
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Quiz
        </Button>
      </Form.Item>
    </Form>
  );
};

export default QuizForm;

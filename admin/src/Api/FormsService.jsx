import React, { useState, useRef } from "react";
import { SearchOutlined, FilterFilled } from "@ant-design/icons";
import {
  Input,
  Button,
  Form,
  Select,
  Switch,
  InputNumber,
  message,
  Modal,
  Table,
  Space,
  Tag,
} from "antd";
import Highlighter from "react-highlight-words";
class FormService {
  constructor() {}
  //forms
  input = (label, name, required, validation, placeholder) => {
    return (
      <Form.Item
        label={label}
        name={name}
        rules={[
          {
            required: required,
            message: validation,
          },
        ]}
      >
        <Input placeholder={placeholder} />
      </Form.Item>
    );
  };

  select = (
    label,
    name,
    required,
    validation,
    options,
    onChange,
    loading,
    multiple,
    placeholder
  ) => {
    return (
      <Form.Item
        label={label}
        name={name}
        rules={[
          {
            required: required,
            message: validation,
          },
        ]}
        className="w_100_p"
      >
        <Select
          className="w_100_p"
          showSearch
          mode={multiple}
          placeholder={placeholder ? placeholder : "Search to Select"}
          optionFilterProp="children"
          onChange={onChange}
          loading={loading}
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={options}
        />
      </Form.Item>
    );
  };

  switch = (label1, name1, default1) => {
    return (
      <Form.Item label={label1} name={name1}>
        <Switch defaultChecked={default1} />
      </Form.Item>
    );
  };

  button = (type, htmltype, text, loading) => {
    return (
      <Form.Item>
        <Button type={type} htmlType={htmltype} loading={loading}>
          {text}
        </Button>
      </Form.Item>
    );
  };
  buttonClick = (type, htmltype, text, loading, onClick) => {
    return (
      <Button
        type={type}
        htmlType={htmltype}
        loading={loading}
        onClick={onClick}
      >
        {text}
      </Button>
    );
  };

  number = (label, name, required, validation) => {
    return (
      <Form.Item
        label={label}
        name={name}
        rules={[
          {
            required: required,
            message: validation,
          },
        ]}
        className="w_100_p"
      >
        <InputNumber className="w_100_p" />
      </Form.Item>
    );
  };

  textarea = (label, name, required, validation) => {
    return (
      <Form.Item
        label={label}
        name={name}
        rules={[
          {
            required: required,
            message: validation,
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>
    );
  };
  //success message
  message = (type, messageText) => {
    return message[type](messageText);
  };

  messageModel = (type, title, content) => {
    Modal[type]({
      title: { title },
      content: { content },
    });
  };
  //table
  tableDynamic = (rowSelection, columns, data, loading) => {
    return (
      <Table
        rowSelection={rowSelection}
        columns={columns}
        loading={loading}
        dataSource={data}
        size="small"
        scroll={{
          x: 1200,
        }}
      />
    );
  };
  //table filter
  tableService = (dataIndex) => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText("");
    };
    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div
          style={{
            padding: 8,
          }}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: "block",
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: filtered ? "#1890ff" : undefined,
          }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "var(--bg)",
              color: "#fff",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    });
    return getColumnSearchProps(dataIndex);
  };
  //table status
  statusTable = (status) => {
    return (_, { status }) => (
      <>
        {status.map((statu) => {
          let color;
          let text;
          if (statu == true) {
            color = "green";
            text = "Active";
          } else {
            color = "orange";
            text = " In Active";
          }
          return (
            <Tag color={color} key={statu}>
              {text}
            </Tag>
          );
        })}
      </>
    );
  };
  //table status
  orderStatusTable = (status) => {
    return (_, { status }) => (
      <>
        {status.map((statu) => {
          let color;
          let text;
          if (statu == "Pending") {
            color = "processing";
            text = "Pending";
          } else if (statu == "Packing") {
            color = "cyan";
            text = " Packing";
          } else if (statu == "Packing") {
            color = "orange";
            text = " Packing";
          } else if (statu == "Billed") {
            color = "magenta";
            text = " Billed";
          } else if (statu == "Dispatched") {
            color = "purple";
            text = " Dispatched";
          } else if (statu == "Delivered") {
            color = "green";
            text = " Delivered";
          } else if (statu == "Cancelled") {
            color = "red";
            text = " Cancelled";
          }
          return (
            <Tag color={color} key={statu}>
              {text}
            </Tag>
          );
        })}
      </>
    );
  };
  //model
  model = (title, open, footer, oncancel, width, body) => {
    return (
      <Modal
        title={title}
        open={open}
        footer={footer}
        onCancel={oncancel}
        width={width}
      >
        {body}
      </Modal>
    );
  };
  //form view
  formview = (key, value) => {
    return (
      <p className="view_block">
        <b>{key + " :"} </b> <span>{value}</span>
      </p>
    );
  };
  formviewnormal = (key, value) => {
    return (
      <p className="d_f f_w_w g_10">
        <b>{key + " :"} </b> <span>{value}</span>
      </p>
    );
  };
}
export default FormService;


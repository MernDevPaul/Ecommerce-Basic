import React, { useEffect, useState } from "react";
import BreadcrumbDynamic from "../../Api/BreadcrumbDynamic";
import {
  Input,
  Image,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import default_img from "../../Assets/Images/pro.png";
import API from "../../Api/ApiService";
import FormService from "../../Api/FormsService";
import {
  enquiryStart,
  enquirySuccess,
  enquiryFailure,
} from "../../Redux/Slice/EnquirySlice";
import { datejs } from 'datejs';
const Enquiry = ({ title }) => {
  const [loading, setLoading] = useState({
    table: false,
  });
  const api = new API();
  const from_service = new FormService();
  const dispatch = useDispatch();
  const lists = useSelector((state) => state?.enquiry?.enquirylist?.data);
  
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const initFunction = async () => {
    setLoading((prev) => ({ ...prev, table: true }));
    await api.getAll(
      dispatch,
      [enquiryStart, enquirySuccess, enquiryFailure, "enquirylist"],
      "enquiry",
      {},
      (err, res) => {
        setLoading((prev) => ({ ...prev, table: false }));
      }
    );
  };
  useEffect(() => {
    initFunction();
  }, []);
  
  //table search
  const handleSearch = (searchText) => {
    const keys = ["name"];
    const filtered = data_table.filter((item) =>
      keys.some((key) =>
        item[key].toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const data_table = lists?.map((e) => ({
    key: e._id ?? "",
    name: e.name ?? "",
    email: e.email ?? "",
    phone: e.phone ?? "",
    message: e.message ?? "",
    date: new Date(e.created_at).toDateString() ?? "",
  }));
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      ...from_service.tableService("name"),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      ...from_service.tableService("email"),
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      ...from_service.tableService("phone"),
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
  ];

  return (
    <>
      <BreadcrumbDynamic title={title} />
      <div className="bg_box p_20">
        <div className="action_head">
          <div className="action_head_left">
            <Input
              size="medium"
              placeholder="Search"
              className="width_230"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="action_head_right">
            
          </div>
        </div>
        {from_service.tableDynamic(
          rowSelection,
          columns,
          filteredData.length > 0 ? filteredData : data_table,
          loading.table
        )}
      </div>
    </>
  );
};

export default Enquiry;

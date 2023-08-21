import React, { useEffect, useState } from "react";
import BreadcrumbDynamic from "../../Api/BreadcrumbDynamic";
import { Form } from "antd";
import { useSelector, useDispatch } from "react-redux";
import API from "../../Api/ApiService";
import FormService from "../../Api/FormsService";
import {
  includesStart,
  includesSuccess,
  includesFailure,
} from "../../Redux/Slice/IncludesSlice";
const Includes = ({ title }) => {
  const [loading, setLoading] = useState({
    delete: false,
    deleteMany: false,
    create: false,
    edit: false,
    update: false,
    view: false,
    table: false,
  });
  const api = new API();
  const from_service = new FormService();
  const [formEdit] = Form.useForm();
  const dispatch = useDispatch();
  const lists = useSelector((state) => state?.includes?.includeslist?.data[0]);
  const [openModal, setOpenModal] = useState({
    type: "", // 'create' or 'edit' or 'delete' or 'deletemany'
    visible: false,
  });
  const openPopup = (type) => {
    formEdit.setFieldsValue(lists);
    setOpenModal({ type: type, visible: true });
  };
  const closePopup = () => {
    setOpenModal({ type: "", visible: false });
  };
  const initFunction = async () => {
    await api.getAll(
      dispatch,
      [includesStart, includesSuccess, includesFailure, "includeslist"],
      "includes",
      {},
      (err, res) => {}
    );
  };
  useEffect(() => {
    initFunction();
  }, []);
  const handleSubmit = async (values, actionType) => {
    if (actionType === "update") {
      setLoading((prev) => ({ ...prev, update: true }));
      await api.update(
        dispatch,
        [includesStart, includesSuccess, includesFailure, "includesedit"],
        "includes",
        "",
        values,
        (err, res) => {
          if (err) {
            from_service.message("error", err?.response?.data?.message);
            setLoading((prev) => ({ ...prev, update: false }));
          } else {
            setLoading((prev) => ({ ...prev, update: false }));
            from_service.message("success", res?.data?.message);
            initFunction();
            closePopup();
          }
        }
      );
    }
  };

  return (
    <>
      <BreadcrumbDynamic title={title} />
      <>
        <div className="company_details_section">
          <div className="company_details_align">
            <div className="company_details_left">
              <div className="bg_box p_25 g_15 col_1">
                <div className="bg_box_head">
                  <h3>Header</h3>
                </div>
                <div className="col_1 g_20">
                  <div className="col_1">{lists?.header}</div>
                </div>
              </div>
              <div className="bg_box p_25 g_15 col_1">
                <div className="bg_box_head">
                  <h3>Footer</h3>
                </div>
                <div className="col_1 g_20">
                  <div className="col_1">{lists?.footer}</div>
                </div>
              </div>
            </div>
            <div className="company_details_right">
              <div className="bg_box p_25">
                <div className="a_r">
                  {from_service.buttonClick(
                    "primary",
                    "submit",
                    "Edit",
                    loading.edit,
                    () => openPopup("edit")
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {from_service.model(
          "Edit",
          openModal.type === "edit",
          null,
          () => closePopup(),
          750,
          <>
            <Form
              layout="vertical"
              form={formEdit}
              onFinish={(e) => handleSubmit(e, "update")}
            >
              {[
                from_service.textarea("Header", "header", false, ""),
                from_service.textarea("Footer", "footer", false, ""),
                from_service.button(
                  "primary",
                  "submit",
                  "Update",
                  loading.update
                ),
              ]}
            </Form>
          </>
        )}
      </>
    </>
  );
};

export default Includes;

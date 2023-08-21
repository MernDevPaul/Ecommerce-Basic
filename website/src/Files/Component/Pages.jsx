import React, { useEffect } from 'react'
import { Breadcrumb, Result, Button } from "antd";
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { commonStart, commonSuccess, commonFailure } from '../Store/Slice/CommonSlice';
import API from '../Api/ApiService';
const Pages = () => {
  const dispatch = useDispatch();
  const api = new API();
  const params = useParams();
  const single_page = useSelector((state) => state?.common?.pagessingle?.data);
  //intiFunction
  const initFunction = async () => {
    await api.getSingle(
      dispatch,
      [commonStart, commonSuccess, commonFailure, "pagessingle"],
      "page",
      params?.slug,
      (err, res) => {
        if (err) {
          dispatch(commonFailure());
          dispatch(commonSuccess({ type: "pagessingle", data: null }));
        }
      }
    );
  }
  //init
  useEffect(() => {
    initFunction();
  }, [params]);
  return (
    <>
      <div className="shop_breadcrumb">
        <div className="wrapper">
          <Breadcrumb
            items={[
              {
                title: "Home",
              },
              {
                title: "Page",
              },
              {
                title: single_page?.title
                  ? single_page?.title
                  : "Sorry, the page you visited does not exist",
              },
            ]}
          />
        </div>
      </div>
      <div className="pages_section">
        <div className="wrapper">
          {single_page ? (
            <div className="pages_section_align">
              <h1>{single_page?.title}</h1>
              <div className="content">
                <div
                  dangerouslySetInnerHTML={{ __html: single_page?.description }}
                />
              </div>
            </div>
          ) : (
            <Result
              status="404"
              title="404"
              subTitle="Sorry, the page you visited does not exist."
              extra={
                <Link to="/">
                  <Button type="primary">Back Home</Button>
                </Link>
              }
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Pages
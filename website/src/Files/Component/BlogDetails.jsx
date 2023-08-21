import React, { useEffect } from "react";
import { Breadcrumb, Result, Button } from "antd";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import pro from "../Assets/Images/pro.png";
import {
  commonStart,
  commonSuccess,
  commonFailure,
} from "../Store/Slice/CommonSlice";
import API from "../Api/ApiService";
const BlogDetails = () => {
  const dispatch = useDispatch();
  const api = new API();
  const params = useParams();
  const single_page = useSelector((state) => state?.common?.blogsingle?.data);
  const list_page = useSelector((state) => state?.common?.bloglist?.data);
  //intiFunction
  const initFunction = async () => {
    await api.getAll(dispatch, [commonStart, commonSuccess, commonFailure, "bloglist"], "blog", {}, (err, res) => {
    });
    await api.getSingle(
      dispatch,
      [commonStart, commonSuccess, commonFailure, "blogsingle"],
      "blog",
      params?.slug,
      (err, res) => {
        if (err) {
          dispatch(commonFailure());
          dispatch(commonSuccess({ type: "blogsingle", data: null }));
        }
      }
    );
  };
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
                title: "Blogs",
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
      <div className="wrapper">
        {single_page ? (
          <div className="blog_align_page">
            <div className="blog_left">
              <h1>{single_page?.title}</h1>
              <div className="blog_content_page">
                <div
                  dangerouslySetInnerHTML={{ __html: single_page?.description }}
                />
              </div>
            </div>
            <div className="blog_right">
              <div className="sub_blog_box current_blog">
                <img
                  src={
                    single_page?.image ? api.apiUrl + single_page?.image : pro
                  }
                  alt={single_page?.title}
                />
              </div>
              <div className="sub_blog_box related_blog">
                <h4>Related Posts</h4>
                <ul>
                  {
                    list_page?.map((item) => {
                      if(item?.slug!==single_page?.slug) return (
                        <Link to={`/blog/${item?.slug}`} key={item?._id}>
                        <li>
                          {item?.title}
                          </li>
                          </Link>
                       
                      );
                    })
                  }
                  
                </ul>
              </div>
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
    </>
  );
};

export default BlogDetails;

import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const Footer = () => {
  const company_list = useSelector((state) => state?.common?.companylist?.data);
  const social = useSelector((state) => state?.common?.social?.data);
  const policy = [
    {
      title: "Privacy Policy",
      link: "/page/privacy-policy",
    },
    {
      title: "Terms and Conditions",
      link: "/page/terms-and-conditions",
    },
    {
      title: "Return Policy",
      link: "/page/return-policy",
    },
    {
      title: "Refund Policy",
      link: "/page/refund-policy",
    },
    {
      title: "Cancellation Policy",
      link: "/page/cancellation-policy",
    },
  ];
  const quick_links = [
    {
      title: "About Us",
      link: "/page/about-us",
    },
    {
      title: "Contact Us",
      link: "/page/contact-us",
    },
    {
      title: "Blogs",
      link: "/page/blogs",
    },
    {
      title: "Enquiry",
      link: "/enquiry",
    }
  ];
  const useful_links = [
    {
      title: "My Address",
      link: "/account/delivery-address",
    },
    {
      title: "My Orders",
      link: "/account/my-order",
    },
    {
      title: "My Profile",
      link: "/account/profile",
    },
    {
      title: "Wishlist",
      link: "/wishlist",
    },
  ];
  return (
    <>
      <div className="footer_section m_t_60 d_i_b w_100_p bg">
        <div className="footer_top">
          <div className="wrapper">
            <div className="foot_top_align d_f a_i_c j_c_s_b">
              <div className="foot_top_left">Sign Up for Newsletter</div>
              <div className="form_sub">
                <input text="text" placeholder="Your Email Address" />
                <button>Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        <div className="footer_bottom">
          <div className="wrapper">
            <div className="footer_align d_f a_i_t j_c_s_b  col_2_lg d_g_lg g_40_lg col_1_sm">
              <div className="w_f_c d_i_b foot_1">
                <h4>Contact Us</h4>
                <ul>
                  <li>
                    {company_list?.address && company_list?.address}
                    {company_list?.city && ", " + company_list?.city}
                    {company_list?.state && ", " + company_list?.state}
                    {company_list?.country && ", " + company_list?.country}
                    {company_list?.pincode && " - " + company_list?.pincode}
                  </li>
                  <li>
                    {company_list?.phone && (
                      <a href={"tel:" + company_list?.phone} title="Call Now">
                        {company_list?.phone}
                      </a>
                    )}
                    {company_list?.landline && (
                      <a
                        href={"tel:" + company_list?.landline}
                        title="Call Now"
                      >
                        {", " + company_list?.landline}
                      </a>
                    )}
                  </li>
                  <li>
                    {company_list?.email && (
                      <a href={"mailto:" + company_list?.email} title="Mail to">
                        {company_list?.email}
                      </a>
                    )}
                  </li>
                </ul>
                <div className="d_f g_20 f_w_w a_i_c social_media">
                  {social?.map((e, i) => {
                    return (
                      <div key={i}>
                        <div>
                          <Link
                            to={e?.url ? e?.url : void 0}
                            title={e?.name}
                            target="_blank"
                          >
                            <img
                              src={
                                e?.image
                                  ? `http://localhost:9000/${e?.image}`
                                  : social
                              }
                              alt="fb"
                            />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="w_f_c d_i_b foot_2">
                <h4>Information</h4>
                <ul>
                  {policy?.map((item, index) => {
                    return (
                      <li key={index}>
                        <Link to={item.link} title={item.title}>
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="w_f_c d_i_b foot_3">
                <h4>Quick Links</h4>
                <ul>
                  {quick_links?.map((item, index) => {
                    return (
                      <li key={index}>
                        <Link to={item.link} title={item.title}>
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="w_f_c d_i_b foot_4">
                <h4>Useful Links</h4>
                <ul>
                  {useful_links?.map((item, index) => {
                    return (
                      <li key={index}>
                        <Link to={item.link} title={item.title}>
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="copy_text">
          <div className="wrapper">
            <p>© 2023; Powered by Developer's Paul</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer
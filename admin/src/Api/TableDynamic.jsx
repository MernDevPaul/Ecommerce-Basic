import React from 'react'
import { Table} from "antd";
const TableDynamic = ({ rowSelection, columns, data, loading }) => {
  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      loading={false}
      dataSource={data}
      size="small"
      scroll={{
        x: 1200,
      }}
    />
  );
};

export default TableDynamic;
import React from "react";

import { CSVLink } from "react-csv";

export default class CSVButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listOfUsers: [],
      loading: false,
    };
  }

  dataFromListOfUsersState = () => {
    return this.state.listOfUsers;
  };

  render() {
    const { loading } = this.state;
    const { ref, headers, filename, dataFromList } = this.props;
    console.log('dataFromList :>> ', dataFromList);
    return (
      <CSVLink
        data={dataFromList}
        filename={filename}
        headers={headers}
        ref={ref}
      >
      </CSVLink>
    );
  }
}

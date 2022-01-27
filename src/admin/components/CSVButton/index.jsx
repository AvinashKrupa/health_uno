import React from "react";
import { Button } from "react-bootstrap";
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
    const { handleExportData, asyncOnClick, headers, filename, dataFromList } = this.props;
    console.log('dataFromList :>> ', dataFromList);
    return (
      <CSVLink
        data={dataFromList}
        filename={filename}
        headers={headers}
        asyncOnClick={asyncOnClick}
        onClick={handleExportData}
      >
        <Button>
          {loading ? "Loading csv..." : "Export to CSV"}
        </Button>
      </CSVLink>
    );
  }
}

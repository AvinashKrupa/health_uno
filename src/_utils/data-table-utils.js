import React from "react";
import moment from "moment";
import {changeCaseFirstLetter, getFormattedDate, getFullName, getNextSlot} from "./common-utils";
import {Link} from "react-router-dom";

export const sorterDate = (a, b) => {
    return moment(a).diff(moment(b), "seconds")
}
export const sorterText = (a, b) => {
    if (!a)
        a = ""
    if (!b)
        b = ""
    return a.localeCompare(b);
}
export const sorterBoolean = (a, b) => {
    if (a&&!b)
        return 1
    else if (b&&!a)
        return -1
    else return 0
}
export const sorterNumber = (a, b) => {
    if (!a)
        a = Number.MIN_SAFE_INTEGER
    if (!b)
        b = Number.MIN_SAFE_INTEGER
    return a - b;
}
export const renderDate = (date) => {
    return (
        <div className="sorting_1">
            {getFormattedDate(date)}
        </div>
    )
}

export const renderName = (record, prefix, suffix, includeImage = false) => {
    return (
        <h2 className="table-avatar">
            {includeImage && <Link to="/profile" className="avatar avatar-sm mr-2">
                <img alt="" src={record.user_id.dp}/>
            </Link>}
            <Link
                to="/profile">{`${prefix ? prefix + " " : ""}${getFullName(record)}${suffix ? " " + suffix : ""}`}</Link>
        </h2>
    )
}
export const renderChips = (items) => {
    return items.map(item => {
        return (<div>{item.title}</div>)
    })
}
export const renderText = (text) => {
    return <div className="sorting_1">
        {changeCaseFirstLetter(text)}
    </div>
}
export const renderBoolean = (value) => {
    return <div className="sorting_1">
        {value ? "Enabled" : "Disabled"}
    </div>
}
export const renderTextWithImage = (text, url) => {
    return <h2 className="table-avatar">
        <a className="avatar avatar-sm mr-2"><img src={url}
                                                  className="avatar-img"
                                                  alt=""/></a>
        <a>{text}</a>
    </h2>
}
export const renderDropDown = (name, items, onItemClick, onButtonClick, showMenu) => {
    return <div className="btn-group">
        <button type="button" onClick={() => onButtonClick()} className="btn btn-primary dropdown-toggle"
                data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">{name}</button>
        <div className={showMenu ? "dropdown-menu show" : "dropdown-menu"}>
            {
                items.map((elem, index) => {
                    return <a className="dropdown-item" onClick={() => {
                        if (onItemClick)
                            onItemClick(elem, index)
                    }}>{changeCaseFirstLetter(elem)}</a>
                })
            }
        </div>
    </div>
}
export const renderEditDisableActions = (handleShow, record) => {
    return <div className="actions">
        <a href="#0" className="btn btn-sm bg-success-light" onClick={() => handleShow('edit')}>
            <i className="fe fe-pencil"></i> Edit</a>
        <a href="#0" className={`btn btn-sm ${record.enabled ? "bg-danger-light" : "bg-success-light"}`}
           onClick={() => handleShow('disable')}>{record.enabled ? " Disable" : " Enable"}</a>
        <a href="#0" className="btn btn-sm bg-danger-light" onClick={() => handleShow('delete')}>
            <i className="fe fe-trash"></i></a>
    </div>

}
export const renderAppointment = (date, text) => {
    return <>
        <span>{getFormattedDate(date)}</span>
        <span className="text-primary d-block">{`${text} - ${getNextSlot(text)}`}</span>
    </>
}

// export const getColumnSearchProps = dataIndex => ({
//     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//         <div style={{ padding: 8 }}>
//             <Input
//                 ref={node => {
//                     this.searchInput = node;
//                 }}
//                 placeholder={`Search ${dataIndex}`}
//                 value={selectedKeys[0]}
//                 onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//                 onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
//                 style={{ marginBottom: 8, display: 'block' }}
//             />
//             <Space>
//                 <Button
//                     type="primary"
//                     onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
//                     icon={<SearchOutlined />}
//                     size="small"
//                     style={{ width: 90 }}
//                 >
//                     Search
//                 </Button>
//                 <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
//                     Reset
//                 </Button>
//                 <Button
//                     type="link"
//                     size="small"
//                     onClick={() => {
//                         confirm({ closeDropdown: false });
//                         this.setState({
//                             searchText: selectedKeys[0],
//                             searchedColumn: dataIndex,
//                         });
//                     }}
//                 >
//                     Filter
//                 </Button>
//             </Space>
//         </div>
//     ),
//     filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
//     onFilter: (value, record) =>
//         record[dataIndex]
//             ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
//             : '',
//     onFilterDropdownVisibleChange: visible => {
//         if (visible) {
//             setTimeout(() => this.searchInput.select(), 100);
//         }
//     },
//     render: text =>
//         this.state.searchedColumn === dataIndex ? (
//             <Highlighter
//                 highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
//                 searchWords={[this.state.searchText]}
//                 autoEscape
//                 textToHighlight={text ? text.toString() : ''}
//             />
//         ) : (
//             text
//         ),
// });

import React, { Component } from 'react';
import debounce from "lodash.debounce";
import { Table, Button, Modal } from 'react-bootstrap/';
import { getPromotions, generatePromotions, createNewPromotion, deletePromotion, updatePromotion } from "../lib/api";
import EditForm from './EditForm';
import '../App.css';

class Promotions extends Component {
    constructor() {
        super();
        this.state = {
            promotions: [],
            total: '',
            schema: {},
            loading: true,
            hasMore: true,
            generating: false,
            showModal: false,
            showEditModal: false,
            error: null,
            currentRow: null,
        }

        // Binds our scroll event handler
        window.onscroll = debounce(() => {
            const {
            fetchPromotions,
            state: {
                error,
                loading,
                hasMore,
            },
            } = this;
             
            if (error || loading || !hasMore) return;
            const offset = this.state.promotions.length;
            // Checks that the page has scrolled to the bottom
            if (window.innerHeight + document.documentElement.scrollTop
                === document.documentElement.offsetHeight) {
                fetchPromotions(offset);
            }
        }, 100);
    }

    scrollToBottom = () => {
        const ele = document.getElementById('promotionsEnd');
        if (ele) {
            ele.scrollIntoView({ top: 100, behavior: "smooth" });
        }  
    }
    
    // componentDidMount() {
    //     this.scrollToBottom();
    // }
    
    // componentDidUpdate() {
    //     this.scrollToBottom();
    // }

    componentWillMount() {
        this.fetchPromotions();
    }

    fetchPromotions = async (offset = 0) => {
        try {
            this.setState({...this.state, loading: true});
            const res = await getPromotions(offset);
            const promotionsData = res.data;
            this.setState({
                ...this.state,
                promotions: [
                    ...this.state.promotions,
                    ...promotionsData.data
                ],
                total: promotionsData.total,
                schema: promotionsData.schema,
                hasMore: (this.state.promotions.length < promotionsData.total),
                loading: false
            });
        } catch (error) {
            this.setState({...this.state, loading: false, error });
        }
    }
    
    openModal = (row) => {
        this.setState({
            showModal: true,
            currentRow: row,
        });
    }

    closeModal = () => {
        this.setState({
            showModal: false,
        });
    }

    openEditModal = (row) => {
        this.setState({
            showEditModal: true,
            currentRow: row,
        });
    }

    closeEditModal = () => {
        this.setState({
            showEditModal: false,
        });
    }

    handleEdit = (row) => {
        this.setState({ ...this.state, showModal: false, showEditModal: true });
    }

    handleUpdate = async (row, id) => {
        const res = await updatePromotion(id, row);
        console.log('resss', res.data);
        if (res.data && res.data.data) {
            const updated = res.data.data;
            updated._id = id;
            const promotions = this.state.promotions.filter(p => p._id !== id);
            promotions.push(updated);
            this.setState({ ...this.state, showEditModal: false, promotions });
        } else {
            this.setState({
                ...this.state,
                error: res.data.errorMessage
            });
        }
    }

    handleDelete = async (row) => {
        const res = await deletePromotion(row._id).catch((err) => {
            console.error('err', err);
            this.setState({ error: err });
        });
        if (res.status && res.status === 200) {
            const data = this.state.promotions.filter(p => p._id !== row._id)
            this.setState({ promotions: data });
        }
        this.setState({ ...this.state, showModal: false });
    }

    handleDuplicate = async (row) => {
        const newRow = { ...row };
        delete newRow._id;
        const res = await createNewPromotion(newRow);
        console.log('resss', res.data);
        const promotions = [
            ...this.state.promotions,
            ...res.data.data
        ];
        this.setState({ ...this.state, showModal: false, promotions });
    }

    // onSubmitHandler = (eve) => {
    //     eve.preventDefault();
    //     alert("submitted")
    // }

    generateJson = async () => {
        const size = 10000;
        const lastId = this.state.total + 1;
        this.setState({ ...this.state, generating: true });
        try {
            const res = await generatePromotions(lastId, size);
            const promotionsData = res.data;
            this.setState({
                ...this.state,
                promotions: [
                    ...this.state.promotions,
                    ...promotionsData.data
                ],
                total: promotionsData.total,
                schema: promotionsData.schema,
                hasMore: (this.state.promotions.length < promotionsData.total),
                loading: false
            });
        } catch (error) {
            this.setState({
                ...this.state,
                promotions: [],
                total: 0,
            });
        }
        this.setState({
            ...this.state,
            generating: false 
        });
    }

    render() {
        const { promotions, schema, total, loading, generating, showModal } = this.state;
                
        return (
            <div className="App">
                <div id='wrapper' className="containerLg">
                        <h1 className="display-4 text-center">Promotions List</h1>
                        <hr />
                        <div className="row">
                            <p className="col-md-6 display-5 bold">Total Promotions: {total}</p>
                            <p className="col-md-6 text-right">
                                <Button variant="info" onClick={!generating ? this.generateJson : null}>
                                {generating ? 'Generating…' : 'Create more rows'}</Button></p>
                        </div>
                        {!loading && <div className='table'>
                            <Table bordered striped={ "true" } hover={ "true" } responsive >
                                <thead>
                                <tr>
                                    <td><input disabled type="checkbox" className="text-center" /></td>
                                    <th> # </th>
                                    {Object.keys(schema).map(col => <th key={col}> {col} </th>)}
                                    <th> Actions </th>
                                </tr>
                                </thead>
                                <tbody>
                                    {promotions.map(row => <tr id={row._id} key={row._id}>
                                        <td><input type="checkbox" className="text-center" /></td>
                                        <td>{row._id}</td>
                                        {Object.keys(schema).map(col => <td key={row._id+'_'+col}> {row[col]} </td>)}
                                        <td><Button variant="primary" onClick={() => this.openModal(row)}>Action</Button></td>
                                    </tr>)}
                                </tbody>
                            </Table>
                            <div id='promotionsEnd' style={{ float:"left", clear: "both" }}></div>
                            {/* <BootstrapTable striped={ true } hover={ true } condensed={ true } data={promotions} responsive
                                tableStyle={ { border: 'gray 2.5px solid' } } 
                                selectRow={ selectRow }>
                                <TableHeaderColumn width='300' isKey dataField='_id'> # </TableHeaderColumn>
                                {Object.keys(schema).map(col => <TableHeaderColumn width='200' sort={"true"} key={col} dataField={col}> {col} </TableHeaderColumn>)}
                                <TableHeaderColumn width='200' dataField='actions'> Actions </TableHeaderColumn>
                            </BootstrapTable> */}
                        </div>}
                        <p className="lead text-center">{this.state.loading ? 'Fetching promotions...' : ''}</p>
                        <Modal show={showModal} onHide={this.closeModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Promption Actions</Modal.Title>
                            </Modal.Header>
                            <Modal.Footer>
                                <Button variant="primary" onClick={() => this.handleEdit(this.state.currentRow)}>
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => this.handleDelete(this.state.currentRow)}>
                                    Delete
                                </Button>
                                <Button variant="primary" onClick={() => this.handleDuplicate(this.state.currentRow)}>
                                    Duplicate
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={this.state.showEditModal} onHide={this.closeEditModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Promotion</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><EditForm data={this.state.currentRow} handleUpdate={this.handleUpdate}/></Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.closeEditModal}>
                                    Cancel
                                </Button>
                            </Modal.Footer>
                        </Modal>
                </div>
            </div>
        )
    }
}



export default Promotions;
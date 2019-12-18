import React, { Component } from 'react';
import { Container, Table, Form, Button } from 'react-bootstrap';
import { FaUserMinus, FaUserPlus, FaPencilAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchVolunteers from '../../redux/actions/fetchVolunteers';
import insertVolunteer from '../../redux/actions/insertVolunteer';
import deleteVolunteer from '../../redux/actions/deleteVolunteer';
import {
    getVolunteersError,
    getVolunteers,
    getVolunteersPending
} from '../../redux/reducers/volunteersReducer';

import { Pagination } from 'react-bootstrap';

const itemsPerPage = 5;

class AdminPanel extends Component {
    state = {
        inputFirstName: '',
        inputLastName: '',
        isSaveButtonEnabled: false,
        selectedPage: 1
    };
    componentDidMount() {
        this.props.fetchVolunteers(0, itemsPerPage);
    }
    handleChangeInput = event => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({ [name]: value });
    };
    handleOnPageSelect = offset => {
        this.props.fetchVolunteers(offset, itemsPerPage);
        this.setState({ selectedPage: offset / itemsPerPage + 1 });
    };
    handleAddVolunteer = newVolunteer => {
        this.props.insertVolunteer(newVolunteer);

        this.handleOnPageSelect(0);

        this.setState({ inputFirstName: '', inputLastName: '' });
    };

    handleDeleteVolunteer = id => {
        const { selectedPage } = this.state;
        let offset = selectedPage * itemsPerPage - itemsPerPage;
        this.props.deleteVolunteer(id);
        this.props.fetchVolunteers(offset, itemsPerPage).then(() => {
            const { items } = this.props.volunteers;
            if (items.length === 0) {
                if (selectedPage > 2) {
                    offset = (selectedPage - 1) * itemsPerPage - itemsPerPage;
                    this.handleOnPageSelect(offset);
                } else {
                    this.handleOnPageSelect(0);
                }
            }
        });
    };
    render() {
        const { items, numberOfPages } = this.props.volunteers;
        let pages = [];
        for (let number = 1; number <= numberOfPages; number++) {
            let endOfPage = number * itemsPerPage;
            pages.push(
                <Pagination.Item
                    onClick={() =>
                        this.handleOnPageSelect(endOfPage - itemsPerPage)
                    }
                    key={number}
                    active={number === this.state.selectedPage}
                >
                    {number}
                </Pagination.Item>
            );
        }

        const pagination = <Pagination>{pages}</Pagination>;

        return (
            <Container fluid>
                <Table className=" table-of-volunteers">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Ime</th>
                            <th scope="col">Prezime</th>
                            <th scope="col">Datum dodavanja</th>
                            <th scope="col"> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((v, i) => {
                            return (
                                <tr key={i}>
                                    <th scope="row">{v.volunteer_id}</th>
                                    <td>{v.first_name}</td>
                                    <td>{v.last_name}</td>
                                    <td>
                                        {format(
                                            new Date(Date.parse(v.created_at)),
                                            'dd.MM.yyyy'
                                        )}
                                    </td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() =>
                                                this.handleDeleteVolunteer(
                                                    v.volunteer_id
                                                )
                                            }
                                        >
                                            {' '}
                                            Izbriši &nbsp;
                                            <FaUserMinus />
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="10">{pagination}</td>
                        </tr>

                        <tr>
                            <td colSpan="5">
                                <div className="border-top my-3"></div>
                                <h4 className="text-muted">
                                    <FaPencilAlt /> &nbsp;Unos novog volontera
                                </h4>
                                <Form>
                                    <Form.Group controlId="formBasicFirstName">
                                        <Form.Label>Ime</Form.Label>
                                        <input
                                            type="text"
                                            name="inputFirstName"
                                            value={this.state.inputFirstName}
                                            onChange={this.handleChangeInput}
                                            className="form-control"
                                            id="exampleInputFirstName1"
                                            placeholder="Unesite ime volontera"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formBasicLastName">
                                        <Form.Label>Prezime</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="inputLastName"
                                            value={this.state.inputLastName}
                                            onChange={this.handleChangeInput}
                                            className="form-control"
                                            placeholder="Unesite prezime volontera"
                                        />
                                    </Form.Group>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        disabled={
                                            !(
                                                this.state.inputFirstName &&
                                                this.state.inputLastName
                                            )
                                        }
                                        onClick={() =>
                                            this.handleAddVolunteer({
                                                first_name: this.state
                                                    .inputFirstName,
                                                last_name: this.state
                                                    .inputLastName,
                                                created_at: new Date().toISOString()
                                            })
                                        }
                                    >
                                        Dodaj &nbsp;
                                        <FaUserPlus />
                                    </Button>
                                </Form>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    error: getVolunteersError(state),
    volunteers: getVolunteers(state),
    pending: getVolunteersPending(state)
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            fetchVolunteers: (offset, limit) => fetchVolunteers(offset, limit),
            insertVolunteer: newVolunteer => insertVolunteer(newVolunteer),
            deleteVolunteer: id => deleteVolunteer(id)
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);

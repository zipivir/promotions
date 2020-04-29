import React, { Component } from 'react';
import TextInput from './common/TextInput';

class EditForm extends Component {
    constructor(props) {
        super();
        const { data } = props;
        this.state = {
            name: data.name,
            promotionType: data.promotionType,
            startDate: data.startDate,
            endDate: data.endDate,
            userGroupName: data.userGroupName,
        }
    }


    onChangeHandler = (eve) => {
        this.setState({ [eve.target.name]: eve.target.value });
    }

    onSubmitHandler = (eve) => {
        eve.preventDefault();
        this.props.handleUpdate(this.state, this.props.data._id);
    }

    render() {
        return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <form onSubmit={this.onSubmitHandler}>
                                <TextInput
                                    name={"name"}
                                    value={this.state.name}
                                    delegateFunc={this.onChangeHandler}
                                    placeholder={"Name"}
                                />
                                <TextInput
                                    name={"promotionType"}
                                    value={this.state.promotionType}
                                    delegateFunc={this.onChangeHandler}
                                    placeholder={"promotionType"}
                                    info='valid types are: Basic / Common / Epic'
                                />
                                <TextInput
                                    value={this.state.startDate}
                                    delegateFunc={this.onChangeHandler}
                                    placeholder={"22-04-2020"}
                                />
                                <TextInput
                                    value={this.state.endDate}
                                    delegateFunc={this.onChangeHandler}
                                    placeholder={"22-04-2020"}
                                />
                                <TextInput
                                    name={"userGroupName"}
                                    value={this.state.userGroupName}
                                    delegateFunc={this.onChangeHandler}
                                    placeholder={""}
                                />
                                <input type="submit" className="btn btn-info btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default EditForm;
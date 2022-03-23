import React, { Component } from 'react';
import Joi from 'joi-browser';

export default class Form extends Component {
    constructor(props){
        super(props);
        this.state = {
            formData: {},
            errors: {}
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleValidate = this.handleValidate.bind(this);
    };

    handleChange(e){
        const clone = Object.assign({}, this.state.formData);
        clone[e.currentTarget.name] = e.currentTarget.value;
        this.setState({ formData: clone });
    };

    handleValidate(e){
        e.preventDefault();
        const result = Joi.validate(this.state.formData, this.validateSchema, { abortEarly: false });
        let errors
        if(!result.error){
            errors = null;
        } else{
            errors = {};

            for (let i of result.error.details){
                errors[i.path[0]] = i.message;
            };
        };
        if(errors){
            this.setState({ errors: errors });
            return;
        }else{
        this.setState({ errors: {} });
        this.handleSubmit();
        };
    };
};
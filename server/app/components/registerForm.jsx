import React, { Component } from 'react';
import Joi from 'joi-browser';
import Form from './form.jsx';
import { register } from '../services/userService';

export default class RegisterUser extends Form {
    constructor(props){
        super(props);
        this.state = {
            formData: {
                username: '',
                email: '',
                password: ''
            },
            errors: {}
        };
        this.handleSubmit = this.handleSubmit.bind(this);

        this.validateSchema = {
            username: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required()
        };
    };
    
    render(){
        return(
            <div className='registerForm'>
                <form ref={(el) => this.myFormRef = el} onSubmit={this.handleValidate}>
                    <input name='username' onChange={this.handleChange} className='registerFormInput' placeholder='Username'></input>
                    <input name='email' onChange={this.handleChange} className='registerFormInput' placeholder='Email'></input>
                    <input name='password' onChange={this.handleChange} className='registerFormInput' placeholder='Password'></input>
                    <button className='registerFormSubmit' id='registerFormSubmit' type='submit'>Register</button>
                </form>
            </div>
        );
    };

    handleSubmit(){
        const payload = {};
        Object.assign(payload, this.state.formData);
        const res = register(payload);
        const emptyForm = { username: '', email: '', password: '' };
        this.setState({ formData: emptyForm });
        this.myFormRef.reset();
    };
};
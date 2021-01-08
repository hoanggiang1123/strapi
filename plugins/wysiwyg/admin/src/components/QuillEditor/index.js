import React, { useState } from "react";
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

var icons = ReactQuill.Quill.import('ui/icons');
icons.header[3] = require('!html-loader!quill/assets/icons/header-3.svg');
icons.header[4] = require('!html-loader!quill/assets/icons/header-4.svg');
icons.header[5] = require('!html-loader!quill/assets/icons/header-5.svg');
 
const Editor = ({ onChange, name, value }) => {
 
 const modules = {
   toolbar: [
     [{ 'header': '1'}, {'header': '2'}, {'header': '3'}, {'header': '4'}, {'header': '5'}, { 'font': [] }],
     [{size: []}],
     ['bold', 'italic', 'underline','strike', 'blockquote'],
     [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
     ['link'],
     ['clean']
   ],
 }
 
 return (
   <ReactQuill
     theme="snow"
     value={value}
     modules={modules}
     onChange={(content, event, editor) => {
       onChange({ target: { name, value: content } });
     }}/>
 );
};
 
export default Editor;
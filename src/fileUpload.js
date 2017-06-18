import React, {Component} from 'react'

class FileUpload extends Component{

    render(){
        return(
            <div>
                <progress value={this.props.uploadValue} max="100"></progress>
                <br />
                <input type="file" onChange={this.props.onUpload}/>
                <br />
            </div>
        )
    }
}

export default FileUpload
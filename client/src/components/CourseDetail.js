import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Data from '../Data'
import ReactMarkdown from 'react-markdown'
export default class CourseDetail extends Component {

  state = {
    course: {},
    createdBy:{},
    message: null
  }

  constructor() {
    super();
    this.data = new Data();
  }

  componentDidMount() {
    this.getCourse(this.props.match.params.id)
        .then((course) => {
            this.setState(() => {
                return {course, createdBy: course.createdBy}
              })
        })
        .catch((error) => {
            this.props.history.push(error.message)
        })

  }

  async getCourse(id) {
    return await this.data.getCourse(id)
        .then(course => course)        
  }


   deleteCourse = async () => {
       if (this.props.context.authenticatedUser) {
            const {emailAddress, password} = this.props.context.authenticatedUser
            await this.data.deleteCourse(this.state.course.id, emailAddress, password)
            .then(message => {
                console.log(message)
                this.props.history.push("/")
            })
            .catch(error => {
                this.props.history.push(error.message)
            })
       } else {
           this.props.history.push('/signin')
       }
  }

  render() {
      const enableActions = (this.props.context.authenticatedUser && (this.props.context.authenticatedUser.id === this.state.createdBy.id) )
    return (
        <div>
            <div className="actions--bar">
                <div className="bounds">
                    <div className="grid-100">
                        {
                            enableActions
                            ? (                        
                            <span>
                                <Link className="button" to={"/courses/" + this.state.course.id + "/update"}>Update Course</Link>
                                <Link className="button" to="#" onClick={this.deleteCourse}>Delete Course</Link>
                            </span>
                            )
                            : null
                       }
                        <Link className="button button-secondary" to="/">Return to List</Link>
                    </div>
                </div>
            </div>
            <div className="bounds course--detail">
                <div className="grid-66">
                    <div className="course--header">
                    <h4 className="course--label">Course</h4>
                    <h3 className="course--title">{this.state.course.title}</h3>
                    <p>By {this.state.createdBy.firstName} {this.state.createdBy.lastName}</p>
                </div>
                <ReactMarkdown className="course--description">
                    {this.state.course.description}
                </ReactMarkdown> 
            </div>
            <div className="grid-25 grid-right">
                <div className="course--stats">
                    <ul className="course--stats--list">
                        <li className="course--stats--list--item">
                        <h4>Estimated Time</h4>
                        <h3>{this.state.course.estimatedTime}</h3>
                        </li>
                        <li className="course--stats--list--item">
                        <h4>Materials Needed</h4>
                        <ul>
                            <ReactMarkdown>
                                {this.state.course.materialsNeeded}
                            </ReactMarkdown> 
                        </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        </div>
    );
  }

}
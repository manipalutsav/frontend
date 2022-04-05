import React from "react";

import StarRatings from 'react-star-ratings';
import { Button } from '../commons/Form';
import '../layouts/base.css'
import '../layouts/fonts.css'


export default class extends React.PureComponent {
  BUTTON_NORMAL = "Submit"
  BUTTON_CLICKED = "Submitting..."
  state = {
    submitted: false,
    button: this.BUTTON_NORMAL
  }
  constructor(props) {
    super(props);
    this.handleRating = this.handleRating.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleSubmit = async (event) => {
    event.preventDefault();


    await this.setState({ button: this.BUTTON_CLICKED })
    typeof window !== "undefined" && window.fetch("https://usebasin.com/f/71436ab3ce6c.json", {
      method: "POST",
      body: JSON.stringify({
        "Which elements of Utsav 2019 did you like the most?": this.state.question1,
        "How useful was Utsav Android App?": this.state.question2,
        "How were the quality of events?": this.state.question3,
        "How would you rate the organization of Utsav?": this.state.question4,
        "Is there anything that would have made experience of Utsav better?": this.state.question5,
        "How likely are you to recommend Utsav to your friends/acquaintances?": this.state.question6,
        "Are you a male or female?": this.state.question7,
        "Are you a student or staff?": this.state.question8
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(() => {
      this.setState({ submitted: true })
    });
  };
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleRating(item, rating) {
    this.setState({ [item]: rating });
  }
  render = () => (

    this.state.submitted === false ?
      <div style={{ padding: 20 }} className="feedback">
        <h1>Feedback for Utsav {new Date().getFullYear()}</h1>
        <form
          // acceptCharset="UTF-8"
          // action="https://usebasin.com/f/71436ab3ce6c"
          // enctype="multipart/form-data"
          // method="POST"
          onSubmit={this.handleSubmit}
          css={{
            display: "flex",
            flexDirection: "column",
          }}
        >

          <div css={{ display: "flex", flexDirection: "column", padding: 20 }}>
            <label htmlFor="question1">Which elements of Utsav 2022 did you like the most?</label>
            <textarea id="question1" rows="4" name="question1" onChange={this.handleChange} placeholder="Feedback" required>
            </textarea>
          </div>

          <div css={{ display: "flex", flexDirection: "column", padding: 20 }}>
            <label htmlFor="question2">How useful was Utsav Android App?</label>
            <StarRatings
              rating={this.state['question2']}
              starRatedColor="gold"
              changeRating={(rating) => this.handleRating('question2', rating)}
              numberOfStars={5}
            />
          </div>

          <div css={{ display: "flex", flexDirection: "column", padding: 20 }}>
            <label htmlFor="android-app">How were the quality of events?</label>
            <StarRatings
              rating={this.state['question3']}
              starRatedColor="gold"
              changeRating={(rating) => this.handleRating('question3', rating)}
              numberOfStars={5}
            />        </div>

          <div css={{ display: "flex", flexDirection: "column", padding: 20 }}>
            <label htmlFor="android-app">How would you rate the organization of Utsav?</label>
            <StarRatings
              rating={this.state['question4']}
              starRatedColor="gold"
              changeRating={(rating) => this.handleRating('question4', rating)}
              numberOfStars={5}
            />
          </div>

          <div css={{ display: "flex", flexDirection: "column", padding: 20 }}>
            <label htmlFor="elements">Is there anything that would have made experience of Utsav better?</label>
            <textarea id="elements" rows="4" name="question5" value={this.state['question5']} onChange={this.handleChange} placeholder="Feedback" required>
            </textarea>
          </div>

          <div css={{ display: "flex", flexDirection: "column", padding: 20 }}>
            <label htmlFor="android-app">How likely are you to recommend Utsav to your friends/acquaintances?</label>
            <StarRatings
              rating={this.state['question6']}
              starRatedColor="gold"
              changeRating={(rating) => this.handleRating('question6', rating)}
              numberOfStars={5}
            />
          </div>
          <div css={{ padding: 20 }}>
            <label htmlFor="android-app">Are you a: </label>
            <input type="radio" name="question7" onChange={this.handleChange} value="male" id="male" /><label htmlFor="male">Male</label>
            <input type="radio" name="question7" onChange={this.handleChange} value="female" id="female" /><label htmlFor="female">Female</label>
          </div>

          <div css={{ display: "flex", flexDirection: "column", padding: 20 }}>
            <label htmlFor="android-app">You are a </label>
            <select name="question8" onBlur={this.handleChange} value={this.state.question8}>
              <option>Student</option>
              <option>Staff</option>
              <option>None of above</option>
            </select>
          </div>

          <input type="hidden" id="gotcha" name="_gotcha" />
          <div css={{ display: "flex", flexDirection: "column", padding: 20 }}>
            <Button styles={{ padding: 40 }} type="submit">{this.state.button}</Button>
          </div>
        </form>
      </div> : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h1>Thank you for your valuable feedback :)</h1>

      </div>
  );
};

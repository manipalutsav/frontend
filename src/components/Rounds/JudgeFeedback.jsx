import React from 'react';
import eventService from '../../services/events';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import useFeedbackStore from '../../store/feedback.store';
export default class JudgeFeedBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      judges: [],
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    try {
      let event = await eventService.get(this.props.event);
      let judges = await useFeedbackStore.getState().getFeedbackByEventId({ event: this.props.event });
    //   let judges = [
    //     {
    //       code: 'J1',
    //       name: 'Judge 1',
    //       comment:
    //         'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    //       score: 10, // Assume max score is 10
    //     },
    //   ];
      this.setState({ event, judges });
    } catch (error) {
      console.log(error);
    }
  };

  render = () => (
    <div>
      <div>
        <h1 className="mucapp mb-8 text-left">
          {this.state.event.name} - Judge Feedback
        </h1>
      </div>
      <div>
        {this.state.judges.length ? (
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                <th className="px-2 py-2 border break-words whitespace-normal">
                  Judges Code
                </th>
                <th className="px-2 py-2 border break-words whitespace-normal">
                  Judges Name
                </th>
                <th className="px-2 py-2 border break-words whitespace-normal max-w-[150px]">
                  Judges' Comment
                </th>
                <th className="px-2 py-2 border break-words whitespace-normal">
                  Judges' Score
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.judges.map((judge, index) => (
                (judge.judge &&
                <tr key={index} className="text-center">
                  <td className="px-2 py-2 border break-words whitespace-normal">
                    {judge.judge.name}
                  </td>
                  <td className="px-2 py-2 border break-words whitespace-normal">
                    {judge.signature}
                  </td>
                  <td className="px-2 py-2 border break-words whitespace-normal max-w-[150px]">
                    {judge.comment}
                  </td>
                  <td className="px-2 py-2 border break-words whitespace-normal">
                    <div className="flex flex-wrap space-x-1 justify-center text-center my-4">
                      {[1, 2, 3, 4, 5].map((star, i) => (
                        <FontAwesomeIcon
                          key={star}
                          icon={faStar}
                          className={`transition-colors ${
                            star <= judge.rating
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          } `}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
                )
              ))}
            </tbody>
          </table>
        ) : (
          <h1 className="mucapp text-center">No results</h1>
        )}
      </div>
    </div>
  );
}

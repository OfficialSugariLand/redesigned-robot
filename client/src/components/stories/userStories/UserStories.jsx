import React from 'react';
import axios from 'axios';
import moment from 'moment';

export default function UserStories({ story, id, user, forceUpdate }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    //Story time calculator
    var todaysDate = moment(new Date());
    const duration = moment.duration(todaysDate?.diff(story?.date_time));
    const storyMinutes = duration._data.minutes;
    const storyHours = duration._data.hours;
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Delete story after 24 hours
    setTimeout(() => {
        if (storyHours > 17) {
            const deleteSory = async () => {
                try {
                    await axiosInstance.delete("/stories/" + story?.id, {
                        data: {
                            id: story?.id,
                        },
                    });
                } catch (err) {
                    console.log(err);
                }
            }
            deleteSory();
            forceUpdate()
        }
    }, [story]);

    return (
        <div className="User_storiesImg" key={id}>
            {story?.follower === user.user_id &&
                <>
                    <img src={PF + story.img} alt="" />
                    {
                        storyHours < 1 ?
                            <>
                                {storyMinutes > 0 &&
                                    <span>
                                        {
                                            storyMinutes < 2 ?
                                                <>
                                                    {storyMinutes + " minute ago"}
                                                </>
                                                :
                                                <>
                                                    {storyMinutes + " minutes ago"}
                                                </>
                                        }
                                    </span>
                                }
                            </>
                            :
                            <span>{storyHours + " hours ago"}</span>
                    }
                </>
            }
        </div>
    )
}

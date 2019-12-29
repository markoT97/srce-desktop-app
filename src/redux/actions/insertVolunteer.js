const { ipcRenderer } = window;
const { channels } = window;

export const INSERT_VOLUNTEER_SUCCESS = 'INSERT_VOLUNTEER_SUCCESS';
export const INSERT_VOLUNTEER_ERROR = 'INSERT_VOLUNTEER_ERROR';

export function insertVolunteerSuccess(volunteer) {
    return {
        type: INSERT_VOLUNTEER_SUCCESS,
        item: volunteer
    };
}

export function insertVolunteerError(error) {
    return {
        type: INSERT_VOLUNTEER_ERROR,
        error: error
    };
}

function insertVolunteer(newVolunteer) {
    return dispatch => {
        ipcRenderer.send(channels.INSERT_VOLUNTEER, newVolunteer);
        ipcRenderer.once(channels.INSERT_VOLUNTEER, (event, insertedID) => {
            if (insertedID) {
                newVolunteer.volunteer_id = insertedID;
                dispatch(insertVolunteerSuccess(newVolunteer));
            } else {
                dispatch(insertVolunteerError('Something went wrong...'));
            }
        });
    };
}

export default insertVolunteer;

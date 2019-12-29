const { ipcRenderer } = window;
const { channels } = window;

export const FETCH_VOLUNTEER_NAMES_PENDING = 'FETCH_VOLUNTEER_NAMES_PENDING';
export const FETCH_VOLUNTEER_NAMES_SUCCESS = 'FETCH_VOLUNTEER_NAMES_SUCCESS';
export const FETCH_VOLUNTEER_NAMES_ERROR = 'FETCH_VOLUNTEER_NAMES_ERROR';

export function fetchVolunteerNamesPending() {
    return {
        type: FETCH_VOLUNTEER_NAMES_PENDING
    };
}

export function fetchVolunteerNamesSuccess(names) {
    return {
        type: FETCH_VOLUNTEER_NAMES_SUCCESS,
        names: names
    };
}

export function fetchVolunteerNamesError(error) {
    return {
        type: FETCH_VOLUNTEER_NAMES_ERROR,
        error: error
    };
}

function fetchVolunteerNames() {
    return dispatch => {
        dispatch(fetchVolunteerNamesPending());

        ipcRenderer.send(channels.GET_VOLUNTEER_NAMES);
        ipcRenderer.once(channels.GET_VOLUNTEER_NAMES, (event, result) => {
            dispatch(fetchVolunteerNamesSuccess(result));
        });
    };
}

export default fetchVolunteerNames;

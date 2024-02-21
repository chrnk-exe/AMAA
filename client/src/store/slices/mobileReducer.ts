import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Socket = {
    ipAddress: '127.0.0.1',
    port: '58526'
}

export const mobileSlice = createSlice({
    name: 'mobile',
    initialState,
    reducers: {
        setSocket: (state: Socket, action: PayloadAction<Socket>) => {
            return action.payload;
        },
    }
})

export const { setSocket } = mobileSlice.actions;
export default mobileSlice.reducer;
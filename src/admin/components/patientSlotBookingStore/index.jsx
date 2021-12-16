import moment from 'moment';
import create from 'zustand'

const patientSlotBookingStore = create(set => ({
  date: moment().format('YYYY-MM-DD'),
  slot_id:'',
  startTime: '',
  setStartTime: (startTime) => set({ startTime: startTime }),
  setDate: (date) => set({ date: date }),
  setSlotId: (id) => set({ slot_id: id }),
}));

export default patientSlotBookingStore;
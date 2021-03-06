import { v4 } from 'uuid'
import { isEqual, getMonth, getYear, getDate } from 'date-fns'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'

import ICreateAppointmentDTO from '@modules/appointments/dtos/IcreateAppointmentDTO'
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'

class FakeAppointmentRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = []

  public async findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id
    )

    return findAppointment
  }

  public async findAllInMonthFromProvider({
    month,
    provider_id,
    year
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      )
    })

    return appointments
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      )
    })

    return appointments
  }

  public async create({
    date,
    provider_id,
    user_id
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment()

    Object.assign(appointment, { id: v4(), date, provider_id, user_id })

    appointment.id = v4()
    appointment.date = date
    appointment.provider_id = provider_id

    this.appointments.push(appointment)

    return appointment
  }
}

export default FakeAppointmentRepository

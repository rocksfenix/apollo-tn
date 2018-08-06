import React from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Doughnut, Line } from 'react-chartjs-2'

import MembersCard from './MembersCard'

const STATISTICS = gql`{
  statistics {
    today {
      free
      pro
      admin
    }
    total {
      free
      pro
      admin
    }
    last30Days {
      free
      pro
      admin
      date
    }
  }
}
`

const Panel = styled.div`
  width: 100%;
  height: 100%;
  background-color: yellow;
  background: #fbfbfb;
  overflow-y: auto;
  overflow-x: hidden;
`
const Row = styled.div`
  width: 100%;
  margin: 1px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  padding: 10px 0;
`
const MiniPanel = styled.div`
  width: 240px;
  height: 150px;
  border: 1px solid #dedede;
  background-color: #FFF;
  border-radius: 5px;
`
const Card = styled.div`
  width: ${props => props.width};
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFF;
  padding: 5px 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 50px rgba(0,0,0,0.05);

  @media(max-width:768px) {
    width: 80%;
  }
`
const getDataDoughnut = (total) => ({
  datasets: [
    {
      data: [ total.pro, total.free, total.admin ],
      backgroundColor: [
        'rgba(47, 19, 200, 0.56)',
        'rgba(0, 175, 255, 0.77)',
        'rgba(0, 0, 0, 0.8)'
      ]
    }
  ],
  labels: [
    'Ninja PRO',
    'Ninja FREE',
    'Ninja Admin'
  ]
})

const getDataLineChart = (last30Days) => ({
  datasets: [
    {
      label: 'Ninja Pro',
      data: last30Days.map(d => d.pro),
      backgroundColor: 'rgba(47, 19, 200, 0.56)',
      pointBorderWidth: 1,
      pointBackgroundColor: '#fff'
    },
    {
      label: 'Ninja Free',
      data: last30Days.map(d => d.free),
      backgroundColor: 'rgba(0, 175, 255, 0.77)',
      pointBorderWidth: 1,
      pointBackgroundColor: '#fff'
    },
    {
      label: 'Ninja Admin',
      data: last30Days.map(d => d.admin),
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      pointBorderWidth: 1,
      pointBackgroundColor: '#fff'
    }
  ],
  labels: last30Days.map(d => d.date.substr(5)),
  scales: {
    yAxes: [{
      ticks: {
        fixedStepSize: 1
      }
    }]
  }
})

export default ({ show }) => {
  if (show) {
    return (
      <Query query={STATISTICS}>
        {({ loading, error, data = {}, client, refetch, networkStatus }) => {
          const { statistics } = data
          console.log(data, error)

          if (!data.statistics) {
            return null
          }
          // return null
          return (
            <Panel>
              <Row>
                <MiniPanel>
                  <MembersCard
                    title='Ninja PRO'
                    today={statistics.today.pro}
                    all={statistics.total.pro}
                  />
                </MiniPanel>
                <MiniPanel>
                  <MembersCard
                    title='Ninja Free'
                    today={statistics.today.free}
                    all={statistics.total.free}
                  />
                </MiniPanel>
                <Card width='300px'>
                  <Doughnut data={getDataDoughnut(statistics.total)} />
                </Card>
              </Row>
              <Row>
                <Card width='90%'>
                  <Line data={getDataLineChart(statistics.last30Days)} height={100} />
                </Card>
              </Row>
            </Panel>
          )
        }}
      </Query>
    )
  }

  return null
}

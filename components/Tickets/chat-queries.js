import gql from 'graphql-tag'

export const SET_DISPONIBILITY = gql`
  mutation availability ($connection: Boolean!) {
    availability(connection: $connection)
  }
`

export const ON_TICKET_CREATE = gql`
  subscription {
    onTicketCreate {
      _id
      text
      status
      priority
      category
      createdAt
      completedAt
      like
      userFeedback
      author {
        fullname
        _id
        email
        role
      }
      customer {
        fullname
        _id
        email
        role
      }
    }
  }
`

export const ON_TICKET_UPDATE = gql`
  subscription {
    onTicketUpdate {
      _id
      text
      status
      priority
      category
      createdAt
      completedAt
      like
      userFeedback
      author {
        fullname
        _id
        email
        role
      }
      customer {
        fullname
        _id
        email
        role
      }
    }
  }
`

export const ON_TICKET_DELETE = gql`
  subscription {
    onTicketDelete {
      _id
      text
      status
      priority
      category
      createdAt
      completedAt
      like
      userFeedback
      author {
        fullname
        _id
        email
        role
      }
      customer {
        fullname
        _id
        email
        role
      }
    }
  }
`

export const ON_TICKET_NOTE_CREATE = gql`
  subscription {
    onTicketNoteCreate {
      _id
      text
      createdAt
      ticket
      author {
        _id
        fullname
        avatar {
          s100
        }
      }
    }
  }
`

export const ON_TICKET_NOTE_UPDATE = gql`
  subscription {
    onTicketNoteUpdate {
      _id
      text
      createdAt
      ticket
      author {
        _id
        fullname
        avatar {
          s100
        }
      }
    }
  }
`

export const ON_TICKET_NOTE_DELETE = gql`
  subscription {
    onTicketNoteDelete {
      _id
      text
      createdAt
      ticket
      author {
        _id
        fullname
        avatar {
          s100
        }
      }
    }
  }
`

export const NEW_CHAT = gql`
  subscription {
    newChat {
      _id
      fullname
      email
      avatar {
        s100
      }
    }
  }
`

export const CHATS = gql`
  query chats($status: String) {
    chats(status: $status) {
      _id
      fullname
      email
      avatar {
        s100
      }
    }
  }
`

export const CLOSE_CHAT = gql`
  mutation closeChat($_id: ID!) {
    closeChat(_id: $_id) {
      _id
      fullname
      email
      avatar {
        s100
      }
    }
  }
`

export const MESSAGES = gql`
  query messages($sender: String!, $receiver: String!, $first: Int, $skip: Int) {
    messages(sender: $sender, receiver: $receiver, first: $first, skip: $skip){
      _id
      text
      sender
      receiver
      createdAt
    }
  }
`

export const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription {
    newMessage {
      _id
      text
      sender
      receiver
      createdAt
    }
  }
`

export const CREATE_MESSAGE = gql`
  mutation messageCreate($text: String!, $receiver: ID!) {
    messageCreate(text: $text, receiver: $receiver) {
      _id
      text
      sender
      receiver
      createdAt
    }
  }
`

export const USER = gql`
  query user ($_id: ID!) {
    user(_id: $_id) {
      _id
      fullname
      slug
      email
      username
      role
      status
      emailConfirmed
      acceptTermsAndPrivacy
      acceptTermsAndPrivacyUpdated
      createdAt
      countViewPro
      countViewSub
      countAttemptsPaymentFailed
      avatar {
        s100
      }
    }
  }
`

export const TICKETS = gql`
  query allTickets ($first: Int, $skip: Int, $customer: ID, $status: String, $priority: String) {
    allTickets (first: $first, skip: $skip, customer: $customer, status: $status, priority: $priority) {
      total
      tickets {
        _id
        text
        status
        priority
        category
        createdAt
        completedAt
        like
        userFeedback
        author {
          fullname
          _id
          email
          role
        }
        customer {
          fullname
          _id
          email
          role
        }
      }
    }
  }
`

export const NEW_TICKET = gql`
  mutation ticketCreate (
      $text: String!
      $customer: ID!
      $priority: String
      $status: String
      $category: String
    ) {
    ticketCreate(input: {
      text: $text
      customer: $customer
      priority: $priority
      status: $status
      category: $category
    }) {
      _id
      text
      status
      priority
      category
      createdAt
      completedAt
      like
      userFeedback
      author {
        fullname
        _id
        email
        role
      }
      customer {
        fullname
        _id
        email
        role
      }
    }
  }
`

export const TICKET_NOTES = gql`
  query ticketNotes($ticket: ID) {
    ticketNotes(ticket: $ticket) {
      _id
      text
      createdAt
      ticket
      author {
        _id
        fullname
        avatar {
          s100
        }
      }
    }
  }
`

export const CREATE_TICKET_NOTE = gql`
  mutation ticketNoteCreate ($text: String!, $ticket: ID!) {
    ticketNoteCreate(text: $text, ticket: $ticket) {
      _id
      text
      createdAt
      ticket
      author {
        _id
        fullname
        avatar {
          s100
        }
      }
    }
  }
`

export const UPDATE_TICKET_NOTE = gql`
  mutation ticketNoteUpdate ($_id: ID!, $text: String!, $ticket: ID!) {
    ticketNoteUpdate(_id: $_id, text: $text, ticket: $ticket) {
      _id
      text
      createdAt
      ticket
      author {
        _id
        fullname
        avatar {
          s100
        }
      }
    }
  }
`

export const DELETE_TICKET_NOTE = gql`
  mutation ticketNoteDelete ($_id: ID!) {
    ticketNoteDelete(_id: $_id) {
      _id
      text
      createdAt
      ticket
      author {
        _id
        fullname
        avatar {
          s100
        }
      }
    }
  }
`

export const DELETE_TICKET = gql`
  mutation ticketDelete ($_id: ID!) {
    ticketDelete(_id: $_id) {
      _id
      text
      status
      priority
      category
      createdAt
      completedAt
      like
      userFeedback
      author {
        fullname
        _id
        email
        role
      }
      customer {
        fullname
        _id
        email
        role
      }
    }
  }
`

export const TICKET_UPDATE = gql`
  mutation ticketUpdate (
      $_id: ID!
      $text: String
      $priority: String
      $status: String
      $category: String
    ) {
    ticketUpdate(input: {
      _id: $_id
      text: $text
      priority: $priority
      status: $status
      category: $category
    }) {
      _id
      text
      status
      priority
      category
      createdAt
      completedAt
      like
      userFeedback
      author {
        fullname
        _id
        email
        role
      }
      customer {
        fullname
        _id
        email
        role
      }
    }
  }
`

import gt from 'graphql-tag'

export const SEARCH_USERS = gt`
  query search_user($user_id: String!, $user_name: String, $email: String, $account_id: String, $apex_account_id: String, $handle: String, $gift_id: String, $gift_receipt_code: String, $object_id: String){
    search_user(input:{user_id: $user_id, user_name: $user_name, email: $email, account_id: $account_id, apex_account_id: $apex_account_id, handle: $handle, gift_id: $gift_id, gift_receipt_code: $gift_receipt_code, object_id: $object_id}) {
      user {
        user_name
        user_id
        email
        create_date
        last_modified_date
        enabled
        status
      }
    }
  }
`

export const GET_USER1 = gt`
  query user($user_name: String){
    user(user_name: $user_name) {
      user_id
      user_name
      first_name
      last_name
      date_of_birth
      image_url
      line_1
      line_2
      city
      state
      country
      post_code
      phone
      email
      ssn_entered
      email_verified
      current_bank_name
      bank_entered
      risk_score
      funding_status
      is_active
      current_funding_source_id
      current_funding_source_status
      current_funding_source_account
      created_by
      created_at
      updated_by
      updated_at
      notification
    }
  }
`
export const FETCH_READ_OBJECT = gt`
  query fetch_read_object($user_id :String){
    fetch_read_object(input: {
      user_id:$user_id
    }) {
      user {
        admin {
          user_id
          user_name
          is_active
          created_by
          created_at
          updated_by
          updated_at
        }
        user_id
        user_name
        first_name
        last_name
        date_of_birth
        image_url
        line_1
        line_2
        city
        state
        country
        post_code
        phone
        email
        ssn_entered
        email_verified
        current_bank_name
        bank_entered
        risk_score
        funding_status
        is_active
        current_funding_source_id
        current_funding_source_status
        current_funding_source_account
        created_by
        created_at
        updated_by
        updated_at
        notification
        feature
        status
        referral_code
        share_code
        handle
        secondary_bank_name
        secondary_bank_account
        sprout {
          sprout_id
          first_name
          last_name
          date_of_birth
          image_url
          broker_dealer_account_id
          broker_dealer_account_status
          ssn_entered
          account_status
          funding_status
          bank_entered
          created_by
          created_at
          updated_by
          updated_at
          notification
          status
          apex_account_id
          share_code
          bank_created
          bank_status
          referral_code
          handle
          secondary_bank_name
          secondary_bank_account
          feature
          attribute {
            user_id
            sprout_id
            is_active
            is_creator
            has_control
            can_contribute
            relationship
            created_by
            created_at
            updated_by
            updated_at
            user {
              user_id
              user_name
              first_name
              last_name
              date_of_birth
              image_url
              line_1
              line_2
              city
              state
              country
              post_code
              phone
              email
              ssn_entered
              email_verified
              current_bank_name
              bank_entered
              risk_score
              funding_status
              is_active
              current_funding_source_id
              current_funding_source_status
              current_funding_source_account
              created_by
              created_at
              updated_by
              updated_at
              notification
              feature
              referral_code
              share_code
              handle
              secondary_bank_name
              secondary_bank_account
            }
          }
          attributes {
            user_id
            sprout_id
            is_active
            is_creator
            has_control
            can_contribute
            relationship
            created_by
            created_at
            updated_by
            updated_at
            user {
              user_id
              user_name
              first_name
              last_name
              date_of_birth
              line_1
              line_2
              city
              state
              country
              post_code
              phone
              email
              ssn_entered
              email_verified
              current_bank_name
              bank_entered
              risk_score
              funding_status
              is_active
              current_funding_source_id
              current_funding_source_status
              current_funding_source_account
              created_by
              created_at
              updated_by
              updated_at
              notification
              feature
              status
              referral_code
              share_code
              handle
              secondary_bank_account
              secondary_bank_name
            }
          }
          goal {
            goal_id
            name
            description
            status
            end_date
            target
            image_url
            sprout_id
            transfer_reference_id
            transfer_reference_status
            current_portfolio_id
            path_id
            path_locked
            created_by
            created_at
            updated_by
            updated_at
            handle
            share_code
            type
            next_transfer_date
            initial_transfer_date
            transfer_amount
            transfer_frequency
            auto_deposit
          }
        }
      }
    }
  }
`

export const FETCH_INFORMATION_OBJECT = gt`
  query fetch_information_object($user_id : String){
    fetch_information_object(input: {
      user_id: $user_id
    }) {
    information {
      birthday
      disclosure_type
      city
      investor_type
      client_id
      assets_worth
      birth_country
      visa_expiration
      employment_status
      state
      income_range
      email
      line_1
      line_2
      middle
      last
      mobile
      disclosure_firm_affiliation_name
      disclosure_political_exposure_organization
      citizenship_country
      visa_type
      last_updated_time
      user_id
      postal_code
      first
      user_ssn_hash
      time_horizon
      liquidity_needs
      employer_name
      trusted_contact {
        first_name
        last_name
        mobile
        email
      }
      admin {
        ssn
        status
        object_id
      }
      sprout {
        date_of_birth
        first_name
        last_name
        sprout_id
        ssn_request_mobile
        ssn_request_email
        ssn_request_time
        ssn_status
        unique_code_url
      }
    }
  }
}
`

export const FETCH_FUNDING_OBJECT = gt`
  query fetch_funding_object($user_id : String!){
    fetch_funding_object(input: {
      user_id: $user_id
    }) {
      funding {
        user_id
        source_reference_id
        funding_source_status
        plaid_verification_time
        type
        bank_routing_number
        account_number
        account_type
        bank_status
        admin {
          bd_latest_event_time
          bd_request_time
          event_Type
          eventTime
          plaid_access_token
          plaid_account_retrieval_time
          plaid_account_id
          plaid_item_id
          plaid_public_token
          request_time
          sources {
            account_id
            account_number
            account_type
            bank_name
            bank_node_id
            bank_routing_number
            bank_user_id
            client_verified
            event_Type
            eventTime
            link_type
            source_deposit
            source_id
            source_label
            source_status
            source_type
            source_withdraw
            swift_code
            verification_method
          }
          bd_funding_source_link {
            source_id
            source_reference_id
            source_status
            __typename
          }
        }
      }
    }
  }
`

// export const GET_USER = gt`
//   query detail($user_name: String){
//     detail(input: {detail: {user_name: $user_name, switches: {
//       admin: true,
//       cognito: true,
//       read: true,
//       information: true
//     }}}) {
//         cognito {
//           user_id
//           email
//           created
//           user_name
//           admin {
//             status
//             email_verified
//             last_modified
//           }
//         }
//         read {
//           user {
//             first_name
//             last_name
//             image_url
//             date_of_birth
//             line_1
//             line_2
//             city
//             state
//             country
//             post_code
//             phone
//             email
//             risk_score
//             ssn_entered
//             bank_entered
//             funding_status
//             notification
//             current_funding_source_id
//             current_funding_source_status
//             current_funding_source_account
//             admin {
//               user_id
//               user_name
//               is_active
//               created_by
//               created_at
//               updated_by
//               updated_at
//             }
//             sprout {
//               sprout_id
//               first_name
//               last_name
//               date_of_birth
//               image_url
//               broker_dealer_account_id
//               broker_dealer_account_status
//               ssn_entered
//               bank_entered
//               account_status
//               funding_status
//               notification
//               admin {
//                 created_by
//                 created_at
//                 updated_by
//                 updated_at
//               }
//               goal {
//                 goal_id
//                 name
//                 description
//                 end_date
//                 target
//                 image_url
//                 sprout_id
//                 current_portfolio_id
//                 path_id
//                 path_locked
//                 admin {
//                   transfer_reference_id
//                   transfer_reference_status
//                   created_by
//                   created_at
//                   updated_by
//                   updated_at
//                 }
//               }
//             }
//           }
//         }
//         information {
//           birthday
//           disclosure_type
//           city
//           investor_type
//           client_id
//           assets_worth
//           birth_country
//           visa_expiration
//           employment_status
//           state
//           income_range
//           email
//           line_1
//           line_2
//           middle
//           last
//           mobile
//           disclosure_firm_affiliation_name
//           disclosure_political_exposure_organization
//           disclosure_political_exposure_family
//           disclosure_control_person_company_symbols
//           disclosure_political_exposure_organization
//           citizenship_country
//           visa_type
//           last_updated_time
//           user_id
//           postal_code
//           first
//           sprout {
//             date_of_birth
//             first_name
//             last_name
//             sprout_id
//             ssn_request_mobile
//             ssn_request_email
//             ssn_request_time
//             ssn_status
//             unique_code_url
//           }
//           admin {
//             ssn
//             status
//             object_id
//           }
//         }
//       }
//     }
// `

export const GET_ACCOUNT = gt`
  query detail($user_name: String){
    detail(input: {detail: {user_name: $user_name, switches: {
      admin: true,
      account: true
    }}}) {
        account {
          user_id
          sprout_id
          account_id
          sketch_investigation_id
          account_status
          request_time
          customer_type
          investor_type
          assets_worth
          income_range
          email
          can_fund
          can_trade
          can_trade_options
          options
          admin {
            user_id
            sprout_id
            account_id
            status
            event_Type
            eventTime
            trade_authorization
            bd_latest_event_time
            bd_account_request_time
            applicants {
              applicant_id
              applicant_type
            }
            bd_account_link {
              account_id
              account_status
              request_time
              user_id
            }
            bd_account_transactions {
              bd_account_id
              bd_object_id
              bd_transaction_id
              amount
              description
              reconciled
              reference
              reservation
              settlement_time
              transaction_id
              transaction_time
              transaction_type
            }
          }
          applicants {
            applicant_type
            assets_worth
            birth_country
            birthday
            citizenship_country
            city
            country
            customer_type
            disclosure_firm_affiliation_name
            disclosure_political_exposure_organization
            disclosure_type
            disclosure_political_exposure_family
            disclosure_control_person_company_symbols
            email
            employment_status
            first
            income_range
            investor_type
            last
            line_1
            line_2
            middle
            mobile
            postal_code
            state
            visa_expiration
            visa_type
            admin {
              account_id
              applicant_id
              sprout_id
              applicant_owner
              bd_applicant_created_time
              user_id
              ssn
              status
            }
          }
          request {
            account_id
            input {
              assets_worth
              income_range
              investor_type
              applicants {
                applicant_type
                birth_country
                birthday
                citizenship_country
                city
                disclosure_firm_affiliation_name
                disclosure_political_exposure_organization
                disclosure_type
                disclosure_political_exposure_family
                disclosure_control_person_company_symbols
                email
                employment_status
                first
                last
                line_1
                line_2
                middle
                mobile
                postal_code
                state
                visa_expiration
                visa_type
                admin {
                  ssn
                }
              }
              admin {
                child_ssn
                parent_ssn
                user_id
                sprout_id
                client_id
              }
            }
          }
        }
      }
    }
`
export const FETCH_ACCOUNT_OBJECT = gt`
  query fetch_account_object($user_id: String!) {
  fetch_account_object(input: {
    user_id: $user_id
  }) {
    user_id
    sprout_id
    account_id
    account_status
    request_time
    customer_type
    investor_type
    assets_worth
    income_range
    email
    can_fund
    can_trade
    can_trade_options
    options
    admin {
      user_id
      sprout_id
      account_id
      status
      event_Type
      eventTime
      trade_authorization
      bd_latest_event_time
      bd_account_request_time
      applicants {
        applicant_id
        applicant_type
      }
      bd_account_link {
        account_id
        account_status
        request_time
        user_id
      }
      bd_account_transactions {
        bd_account_id
        bd_object_id
        bd_transaction_id
        amount
        description
        reconciled
        reference
        reservation
        settlement_time
        transaction_id
        transaction_time
        transaction_type
      }
    }
    applicants {
      applicant_type
      assets_worth
      birth_country
      birthday
      citizenship_country
      city
      country
      customer_type
      disclosure_firm_affiliation_name
      disclosure_political_exposure_organization
      disclosure_type
      email
      employment_status
      first
      income_range
      investor_type
      last
      line_1
      line_2
      middle
      mobile
      postal_code
      state
      visa_expiration
      visa_type
    }
    request {
      account_id
    }
    sketch_investigation_id
  } 
  
}
`

export const GET_FUNDING = gt`
  query detail($user_name: String){
    detail(input: {detail: {user_name: $user_name, switches: {
      admin: true,
      funding: true,
    }}}) {
        funding {
          user_id
          source_reference_id
          funding_source_status
          plaid_verification_time
          type
          bank_routing_number
          account_number
          account_type
          admin {
            bd_latest_event_time
            bd_request_time
            event_Type
            eventTime
            funding_source_status
            plaid_access_token
            plaid_account_retrieval_time
            plaid_account_id
            plaid_item_id
            plaid_public_token
            plaid_verification_time
            request_time
            source_reference_id
            user_id
            sources {
              account_id
              account_number
              account_type
              bank_name
              bank_routing_number
              client_verified
              source_deposit
              source_id
              source_label
              source_status
              source_type
              source_withdraw
              swift_code
              verification_method
            }
            bd_funding_source_link {
              source_id
              source_reference_id
              source_status
            }
          }
        }
      }
    }
`

export const GET_ORDERS = gt`
  query detail($user_name: String){
    detail(input: {detail: {user_name: $user_name, switches: {
      admin: true,
      instruction: true
    }}}) {
      orders {
        admin {
          security_order_links {
            quantity
            security_order_status
            security_order_id
            symbol
            total_amount
            type
            allocations {
              account
              amount
            }
          }
          bd_orders {
            bd_order_id
            bd_order_status
            security_order_id
            payload {
              all_or_none
              allocation_type
              limit_price
              order_type
              quantity
              time_in_force
              allocations {
                account
                amount
              }
              legs {
                asset_type
                position_effect
                side
                symbol
              }
            }
          }
        }
      }
    }
  }
`

export const GET_BANK = gt`
  query detail($user_name: String){
    detail(input: {detail: {user_name: $user_name, switches: {
      admin: true,
      bank: true,
    }}}) {
      bank {
        bd_transfer_id
        sprout_id
        transfer_status
        type
        total_amount
        total_transfers
        bd_transfer_request_time
        admin {
          user_id
          bd_account_id
          bd_account_check_grace_date
          bd_apex_account_check_time
          bd_apex_request_date
          bd_source_id
          bd_transfer_latest_event_time
          bd_transfer_status
          total_amount
          total_transfers
          transfer_transit_link {
            bd_account_check_grace_date
            bd_account_id
            bd_apex_account_check_time
            bd_apex_request_date
            bd_transfer_id
            total_amount
            total_transfers
            transfer_status
            user_id
          }
        }
        transfers {
          individual_transfer_id
          individual_transfer_amount
          admin {
            bd_account_id
            bd_transfer_id
            transfer_reference_id
          }
        }
      }
    }
  }
`

export const GET_ACCOUNT_STATEMENTS = gt`
  query detail($user_name: String) {
    detail(input: {detail: {user_name: $user_name, switches: {
      admin: true, 
      broker_dealer: {
        account_statement: true
      }
    }}}) {
      broker_dealer {
        sprout_id
        account_id
        account_statement {
          date
          url
          statement_type
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

export const GET_BROKER_DEALER_CONFIRMATIONS = gt`
  query detail($user_name: String){
    detail(input: {detail: {user_name: $user_name, switches: {
      admin: true,
      broker_dealer: {        
        confirmations: true,
      }
    }}}) {
      broker_dealer {
        sprout_id
        account_id        
        confirmations {
          date
          url
        }
      }
    }
  }
`

export const GET_INSTRUCTION = gt`
  query detail($user_name: String){
    detail(input: {detail: {user_name: $user_name, switches: {
      admin: true,
      instruction: true,
    }}}) {
      instruction {
        sprout {
          sprout_id
          goal {
            goal_id
            transfers {
              goal_id
              next_transfer_date
              transfer_reference_id
              transfer_status
              user_id
							amount
							total_amount
              initial_request_time
              initial_transfer_date
              type
              version
              frequency
              transfer_type
              sub_type
              comments
              external_reference_id
              admin {
                user_id
                sprout_id
                goal_id
                bd_account_id
                bd_account_lookup_time
                bd_funding_source_lookup_time
                next_transfer_date
                last_transaction_status
                last_updated_request_time
                plaid_access_token
                plaid_account_id
                source
                source_reference_id
                transfer_reference_id
                event_Type
                eventTime
                transfer_status
              }
              transactions {
                individual_transfer_request_time
                individual_transfer_id
                individual_transfer_amount
                individual_transfer_status
                amount_allocated {
                  equity
                  amount
                }
                securities_allocated {
                  equity
                  units
                }
                admin {
                  bd_transfer_id
                  order_link {
                    bd_transfer_id
                    individual_transaction_id
                    order_id
                    order_status
                    transaction_type
                  }
                  bd_transfer {
                    bd_transfer_id
                    bd_account_id
                    bd_apex_account_check_time
                    bd_source_id
                    bd_transfer_latest_event_time
                    bd_transfer_request_time
                    bd_transfer_status
                    total_amount
                    total_transfers
                    type
                    user_id
                  }
                  transfer_transit_link{
                    bd_account_check_grace_date
                    bd_account_id,
                    bd_apex_account_check_time
                    bd_apex_request_date
                    transfer_status
                    total_amount
                    total_transfers,
                    transfer_status
                    user_id
                  }
                  order {
                    user_id
                    sprout_id
                    goal_id
                    instruction_reference_id
                    bd_account_id
                    bd_transfer_id
                    individual_transaction_id
                    order_id
                    order_status
                    transaction_amount
                    transaction_type
                  }
                  transaction_security_trade {
                    user_id
                    sprout_id
                    goal_id
                    instruction_reference_id
                    bd_account_id
                    bd_transfer_id
                    individual_transaction_id
                    order_id
                    transaction_security_trade_id
                    trade_status
                    transaction_amount
                    transaction_type
                    amount_allocated {
                      equity
                      amount
                    }
                    securities_allocated {
                      equity
                      units
                    }
                  }
                  security_order {
                    user_id
                    sprout_id
                    goal_id
                    transfer_reference_id
                    bd_account_id
                    bd_transfer_id
                    individual_transaction_id
                    order_id
                    transaction_security_trade_id
                    security_order_id
                    transaction_amount
                    transaction_type
                    security_order_status
                    amount_allocated {
                      equity
                      amount
                    }
                    securities_allocated {
                      equity
                      units
                    }
                  }
                }
              }
            }
            withdrawals {
              user_id
              sprout_id
              goal_id
              withdrawal_instruction_id
              next_withdrawal_date
              portfolio_id
              withdrawal_status
							amount
							total_amount
              frequency
              initial_request_time
              initial_withdrawal_date
              instruction_type
              admin {
                user_id
                sprout_id
                goal_id
                withdrawal_instruction_id
                source_id
                source_reference_id
                next_withdrawal_date
                portfolio_id
                withdrawal_status
                bd_account_check_time
                bd_account_id
                bd_funding_source_check_time
                last_updated_request_time
              }
              transactions {
                individual_withdrawal_id
                individual_withdrawal_request_time
                individual_withdrawal_amount
                individual_withdrawal_status
                amount_allocated {
                  equity
                  amount
                }
                securities_allocated {
                  equity
                  units
                }
                admin {
                  withdrawal_transaction {
                    user_id
                    sprout_id
                    goal_id
                    withdrawal_instruction_id
                    individual_withdrawal_id
                    bd_account_id
                    source_reference_id
                    source_id
                    withdrawal_date
                    individual_withdrawal_amount
                    current_portfolio_id
                    withdrawal_status
                  }
                  bd_transfer {
                    bd_transfer_id
                    bd_account_id
                    bd_source_id
                    bd_transfer_latest_event_time
                    bd_transfer_request_time
                    bd_transfer_status
                    total_amount
                    total_transfers
                    type
                    user_id
                  }
                  order_link {
                    withdrawal_instruction_id
                    individual_withdrawal_id
                    individual_transaction_id
                    order_id
                    transaction_type
                    order_status
                  }
                  order {
                    user_id
                    sprout_id
                    goal_id
                    withdrawal_instruction_id
                    individual_withdrawal_id
                    bd_account_id
                    order_id
                    transaction_type
                    individual_withdrawal_amount
                    order_status
                  }
                  transaction_security_trade {
                    user_id
                    sprout_id
                    goal_id
                    withdrawal_instruction_id
                    individual_transaction_id
                    individual_withdrawal_id
                    bd_account_id
                    source_reference_id
                    source_id
                    order_id
                    transaction_security_trade_id
                    individual_withdrawal_amount
                    transaction_type
                    current_portfolio_id
                    trade_status
                    amount_allocated {
                      equity
                      amount
                    }
                    securities_allocated {
                      equity
                      units
                    }
                  }
                  security_order {
                    user_id
                    sprout_id
                    goal_id
                    withdrawal_instruction_id
                    individual_withdrawal_id
                    bd_account_id
                    order_id
                    transaction_security_trade_id
                    security_order_id
                    transaction_amount
                    transaction_type
                    current_portfolio_id
                    security_order_status
                    amount_allocated {
                      equity
                      amount
                    }
                    securities_allocated {
                      equity
                      units
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const GET_EVENTS = gt`
  query detail($object_id: String, $sequence_number: String){
    search_event(input: {object_id: $object_id, sequence_number: $sequence_number}){
      event{
        account_id
        application_id
        object_id
        seq
        status
        timestamp
        type
      }
    }
  }
`

export const GET_PROPERTIES = gt`
  query fetch_property {
    fetch_property(input: "fetch_property_values"){
      property {
        key
        MapAttribute
      }
    }
  }
`

export const GET_PERFORMANCE = gt`
  query fetch_portfolio {
    fetch_performance(input: "fetch_performance_values"){
      performance {
        backdrop_image
        cms_id
        description
        dividend_yield
        expenses
        holdings
        image
        is_dream
        last_price
        name
        portfolio_id
        return_since_inception
        standard_deviation
        ticker
        type
        underlying
        url
        what_is_the_investment
        what_will_they_learn
        year_10_change_percent
        year_1_change_percent
        year_3_change_percent
        year_5_change_percent
      } 
    }
  }
`

export const GET_PORTFOLIO = gt`
  query fetch_portfolio {
    fetch_portfolio(input: "fetch_portfolio_values"){
      portfolio {
        profile_index
        securities {
          glide_path
          security_name
          security_type
        }
      }
    }
  }
`

export const GET_USER_DETAIL = gt`
  query get_user_detail($object_id: String, $user_name: String) {
    detail(input: {
      client_id: "support_utility",
      detail: {
        user_name: $user_name,
        object_id: $object_id,
        switches: {
          user_detail: true
        }
      }
    }) {
      user_detail {
        user_id
        object_id
        last_updated_time
        user {
          available_value
					bank_entered
					current_bank_name          
          current_funding_source_account
          current_funding_source_id
          current_funding_source_status
          current_value
          date_of_birth
					email
					email_verified
					first_name
					funding_status
          growth_in_percentage
          growth_in_value          
					last_name
					notification
          pending_transfer_amount
          pending_withdrawal_amount
          risk_score
          ssn_entered
          total_contributions
          user_id
        }
        sprouts {
          account_status
          available_value
          bank_entered
          broker_dealer_account_id
          broker_dealer_account_status
          current_value
          date_of_birth
          first_name
          funding_status
          growth_in_percentage
          growth_in_value
          image_url
					last_name
					notification
          pending_transfer_amount
          pending_withdrawal_amount
          sprout_id
          ssn_entered
          total_contributions
          goals {
            available_value
            current_portfolio_id
            current_value
            end_date
            goal_id
            growth_in_percentage
            growth_in_value
            name
            path_id
            path_locked
            pending_transfer_amount
            pending_withdrawal_amount
            target
            ticker_name
            total_contributions
          }
        }
        instructions {
          instruction_amount
          instruction_freqeuncy
          instruction_goal_id
          instruction_goal_name
          instruction_initial_date
          instruction_next_activity_date
          instruction_reference
          instruction_request_time
          instruction_sprout_first_name
          instruction_sprout_id
          instruction_sprout_last_name
          instruction_status
					instruction_type
					instruction_sub_type
					instruction_comments
					instruction_external_reference_id
        }
        transactions {
          transaction_amount
          transaction_goal_id
          transaction_goal_name
          transaction_instruction_reference
          transaction_reference_id
          transaction_sprout_first_name
          transaction_sprout_id
          transaction_sprout_last_name
					transaction_status
					transaction_sub_type
					transaction_comments
					transaction_external_reference_id
          transaction_time
          transaction_type         
        }
        stocks {
          stock_available_units
          stock_current_value
          stock_fetch_time
          stock_growth_in_percentage
          stock_growth_in_value
          stock_invested_amount
          stock_name
          stock_ticker
          stock_unit_price
          stock_units
        }
      }
    }
  }
`

export const GET_SPROUT_DETAIL = gt`
  query get_user_detail($object_id: String, $user_name: String) {
    detail(input: {
      client_id: "support_utility",
      detail: {
        user_name: $user_name,
        object_id: $object_id,
        switches: {
          sprout_detail: true
        }
      }
    }) {
      sprout_detail {
        sprout_id
        object_id
        last_updated_time
        sprout {
          account_status
          available_value
          bank_entered
          broker_dealer_account_id
          broker_dealer_account_status
          current_value
          date_of_birth
          first_name
          funding_status
          growth_in_percentage
          growth_in_value
          image_url
          last_name
          pending_transfer_amount
          pending_withdrawal_amount
          sprout_id
          ssn_entered
          total_contributions
        }
        goals {
          available_value
          current_portfolio_id
          current_value
          end_date
          goal_id
          growth_in_percentage
          growth_in_value
          name
          path_id
          path_locked
          pending_transfer_amount
          pending_withdrawal_amount
          target
          ticker_name
          total_contributions
        }     
        instructions {
          instruction_amount
          instruction_freqeuncy
          instruction_goal_id
          instruction_goal_name
          instruction_initial_date
          instruction_next_activity_date
          instruction_reference
          instruction_request_time
          instruction_sprout_first_name
          instruction_sprout_id
          instruction_sprout_last_name
          instruction_status
					instruction_type
					instruction_sub_type
					instruction_comments
					instruction_external_reference_id
        }
        transactions {
          transaction_amount
          transaction_goal_id
          transaction_goal_name
          transaction_instruction_reference
          transaction_reference_id
          transaction_sprout_first_name
          transaction_sprout_id
          transaction_sprout_last_name
					transaction_status
					transaction_sub_type
					transaction_comments
					transaction_external_reference_id
          transaction_time
          transaction_type         
        }
        stocks {
          stock_available_units
          stock_current_value
          stock_fetch_time
          stock_growth_in_percentage
          stock_growth_in_value
          stock_invested_amount
          stock_name
          stock_ticker
          stock_unit_price
          stock_units
        }
      }
    }
  }
`

export const GET_GOAL_DETAIL = gt`
  query get_user_detail($object_id: String, $user_name: String) {
    detail(input: {
      client_id: "support_utility",
      detail: {
        user_name: $user_name,
        object_id: $object_id,
        switches: {
          goal_detail: true
        }
      }
    }) {
      goal_detail {
        goal_id
        object_id
        last_updated_time
        goal {
          available_value
          current_portfolio_id
          current_value
          end_date
          goal_id
          growth_in_percentage
          growth_in_value
          name
          path_id
          path_locked
          pending_transfer_amount
          pending_withdrawal_amount
          target
          ticker_name
					total_contributions
					is_active
        }      
        instructions {
          instruction_amount
          instruction_freqeuncy
          instruction_goal_id
          instruction_goal_name
          instruction_initial_date
          instruction_next_activity_date
          instruction_reference
          instruction_request_time
          instruction_sprout_first_name
          instruction_sprout_id
          instruction_sprout_last_name
          instruction_status
					instruction_type
					instruction_sub_type
					instruction_comments
					instruction_external_reference_id
        }
        transactions {
          transaction_amount
          transaction_goal_id
          transaction_goal_name
          transaction_instruction_reference
          transaction_reference_id
          transaction_sprout_first_name
          transaction_sprout_id
          transaction_sprout_last_name
					transaction_status
					transaction_sub_type
					transaction_comments
					transaction_external_reference_id
          transaction_time
          transaction_type         
        }
        stocks {
          stock_available_units
          stock_current_value
          stock_fetch_time
          stock_growth_in_percentage
          stock_growth_in_value
          stock_invested_amount
          stock_name
          stock_ticker
          stock_unit_price
          stock_units
        }
      }
    }
  }
`

export const GET_LIST_DOCUMENTS = gt`
  query list_documents($user_id: String!, $sprout_id: String!) {
    list_documents(input: {
      user_id: $user_id,
      sprout_id: $sprout_id
    }) {
      document{
        key
        meta_data {
          user_id
          sprout_id
          role
          document_type
          apex_account_id
          tag
          status
          snap_id
          bit
        }
      }
    }
  }
`

//get investigation list
export const FETCH_INVESTIGATION_STATUS = gt`
  query fetch_investigation_status($user_id: String!, $sketch_id: String!, $account_id: String!) {
    fetch_investigation_status(input:{
      user_id: $user_id
      sketch_id: $sketch_id
      account_id: $account_id
    }){
      id
      status
      archived
      history{
        user
        timestamp
        state_change
        comment
        archived
      }
      request{
        identity{
          name{
            prefix
            given_name
            additional_names
            family_name
            suffix
          }
          home_address{
            street_address
            city
            state
            postal_code
            country
          }
          mailing_address{
            street_address
            city
            state
            postal_code
            country
          }
          phone_number
          social_security_number
          citizenship_country
          date_of_birth
        }
        include_identity_verification
        correspondent_code
        branch
        account
        source
        source_id
      }
      result{
        evaluation{
          evaluated_state
          data_sources
        }
        equifax_result
        dow_jones_result
        dow_jones_notes
        dow_jones_sources
        dndb_result
      }
      cip_categories{
        name
        category_state
        requested_documents {
        name
        description
      }
    }
      submitted_documents
    }
  }
`

export const GET_BINARY_IMAGE = gt`
  query view_document($key: String!, $user_id: String!) {
    view_document(input: {
      key: $key,
      user_id: $user_id
    }) {
      binary_image_data
    }
  }
`

export const VIEW_PROFILE_IMAGE = gt`
  query view_profile_image($key: String!, $user_id: String!) {
    view_profile_image(input: {
      key: $key,
      user_id: $user_id
    }) {
      binary_image_data
    }
  }
`

export const APPROVE_DOCUMENT = gt`
  mutation approve_document($key: String!, $user_id: String!, $apex_account_id: String,$account_id : String!){
    approve_document(input: {
      key: $key,
      user_id: $user_id,
      apex_account_id: $apex_account_id,
      account_id:$account_id
    }) {
      message
      snap_id
    }
  }
`

export const GET_ALE_EVENTS = gt`
  query fetch_ale_events($user_id: String!, $account_id: String!, $type: String!) {
    fetch_ale_events(input: {
      user_id: $user_id
      account_id: $account_id,
      type: $type
    }) {
      event
      raw_event{
        date_time
        payload
        id
      }
      transformed_event
    }
  }
`

export const CLOSE_ACCOUNT = gt`
  mutation close_account($user_id: String!, $account_id: String!){
    close_account(input:{
      user_id:$user_id
      account_id:$account_id
    }){
      message
    }
  }
`
export const SIMULATE_ACH_RETURN = gt`
  mutation simulate_ach_return($account_id: String!, $user_id: String!,$transfer_id: String!) {
    simulate_ach_return(input:{
      account_id:$account_id
      user_id:$user_id
      transfer_id:$transfer_id
    }){
      status
      timestamp
    }
  }
`

export const CANCEL_TRANSFER = gt`
  mutation cancel_transfer($account_id: String!, $user_id: String!,$transfer_id: String!, $comment: String!){
    cancel_transfer(input:{
      account_id:$account_id
      transfer_id:$transfer_id
      comment:$comment
      user_id: $user_id
    }){
      mechanism
      direction
      amount
      external_transfer_id
      transfer_id
      estimated_funds_available_date
      ach_relationship_id
      fees
      status
      timestamp 
    }
  }
`

export const SIMULATE_ACH_NOC = gt`
  mutation simulate_ach_noc($account_id: String!,$transfer_id: String!,$user_id: String!, $new_account_number: String!,
    $new_routing_number: String!,$new_bank_account_type: String!){
    simulate_ach_noc(input: {
      account_id:$account_id,
      user_id:$user_id
      transfer_id:$transfer_id,
      new_account_number: $new_account_number,
      new_routing_number: $new_routing_number,
      new_bank_account_type: $new_bank_account_type
    }) {
      status
      timestamp
    }
  }
`
export const ADD_TRUSTED_CONTACT = gt`
  mutation add_trusted_contact($account_id: String!, $user_id: String!, $first_name: String!,$last_name: String!,
    $email: String, $mobile: String) {
    add_trusted_contact(input: {
      account_id: $account_id,
      user_id: $user_id,
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      mobile: $mobile,
    }) {
        account_id
        status
      can_trade
      can_trade_options
      can_fund
      margin_agreement
      customer_type
      options
      trade_authorization
      applicants {
        applicant_id
        applicant_type
        name {
          first
          middle
          last
        }
        email
        birthday
        ssn
        w8_ben_tax_id
        birth_country
        citizenship_country
        mobile
        employment_status
        employer
        address {
          line_1
          city
          line_2
          state
          postal_code
          country
        }
        disclosures {
          political_exposure {
            organization
            family
          }
        }
        beneficiaries {
          beneficiary_id
          beneficiary_type
          name{
            first
            middle
            last
          }
          birthday
          ssn
          relationship
          share_percent
          address {
            line_1
            city
            line_2
            state
            postal_code
            country
          }
        }
        foreign_application {
          nature_of_business
          banks
          estimated_initial_deposit
          activity_type
          expected_withdrawals
        }
        risk_profile {
          time_horizon
          liquidity_needs
          investment_objective
          investment_experience
          risk_tolerance
          annual_income
          liquid_net_worth
          total_net_worth
          num_dependents
          marital_status
        }
      }
      notes {
        note
        timestamp
      }
      
    }
  }
`

export const VEIW_TRUSTED_CONTACT = gt`
  query fetch_trusted_contact($account_id: String!, $user_id: String!) {
    fetch_trusted_contact(input:{
      user_id:$user_id
      account_id:$account_id
    }){
      applicant_id
      applicant_type
      name{
        first
        last
        middle
      }
      email
      birthday
      ssn
      w8_ben_tax_id
      birth_country
      citizenship_country
      mobile
      employment_status
      employer
      address{
        line_1
        line_2
        city
        postal_code
        country
        state
      }
      disclosures{
        political_exposure{
          organization
          family
        }
        visa{
          type
          expiration
        }
        control_person{
          company_symbols
        }
        firm_affiliation{
          name
        }
        documents{
          file_id
          type
        }
      }
    }
  }
`

export const SKETCH_INVESTIGATION = gt`
  mutation sketch_investigation($user_id: String!, $account_id: String!, $sketch_id: String!, $snap_ids: [String], $action: String!,$comments : String! ){
    sketch_investigation(input:{
      user_id:$user_id
      account_id:$account_id
      sketch_id:$sketch_id
      snap_ids: $snap_ids
      action: $action,
      comments : $comments
    }){
        id
    status
    archived
    history{
      user
      timestamp
      state_change
      comment
      archived
    }
    request{
      identity{
        name{
          prefix
          given_name
          additional_names
          family_name
          suffix
        }
        home_address{
          street_address
          city
          state
          postal_code
          country
        }
        mailing_address{
          street_address
          city
          state
          postal_code
          country
        }
        phone_number
        social_security_number
        citizenship_country
        date_of_birth
      }
      include_identity_verification
      correspondent_code
      branch
      account
      source
      source_id
    }
    result{
      evaluation{
        evaluated_state
        data_sources
      }
      equifax_result
      dow_jones_result
      dow_jones_notes
      dow_jones_sources
      dndb_result
    }
    cip_categories{
      name
      category_state
      requested_documents{
        name
        description
      }
    }
    submitted_documents
  }
}
`
/*-=-=-=-=*/
export const SNAP_DOCUMENT = gt`
  query fetch_snap_document($user_id: String!, $snap_id: String!,$account_id : String!) {
    fetch_snap_document(input: {
      user_id: $user_id,
      snap_id: $snap_id,
      account_id:$account_id
    }) {
      document
    }
}
`
export const SNAP_DOCUMENT_METADATA = gt`
  query fetch_snap_document_metadata($user_id: String!, $snap_id: String!, $account_id: String!) {
    fetch_snap_document_metadata(input: {
      user_id: $user_id,
      snap_id: $snap_id,
      account_id: $account_id
    }) {
      id
      account
      correspondent
      tag
      tags
      image_name
      uploaded_by {
        subject
        user_entity
        user_class
      }
      uploaded_on
    }
  }
`
export const UPLOAD_DOCUMENT = gt`
  mutation upload_document($user_id: String!, $sprout_id: String!, $document_type: String!, $tag: String! ){
    upload_document(input:{
      user_id:$user_id
      sprout_id:$sprout_id
      document_type:$document_type
      tag: $tag   
    }){
      key
      status
    }
  }
`
export const GET_INVESTMENT_PROFILE = gt`
  query fetch_investment_profile(
    $account_id: String!,
    $user_id: String!
  ){
    fetch_investment_profile(input: {
    account_id: $account_id,
    user_id: $user_id
  }) {
      investment_objective
      investment_experience
      annual_income_usd 
      liquid_net_worth_usd 
      total_net_worth_usd 
      risk_tolerance
      federal_tax_bracket_percent
    }
  }
`

export const GET_SUITABILITY = gt`
  query detail($user_name: String!){
    detail(input: {
      client_id: "123",
      detail: {
        user_name: $user_name,
        switches: {
          information: true
        }
      }
    }) {
      information {
        time_horizon
        liquidity_needs
      }
    }
  }
`

export const GET_ACCOUNT_PREFERENCES = gt`
  query fetch_account_preferences($user_id: String!, $account_id: String!){
    fetch_account_preferences(input: {
      user_id: $user_id,
      account_id: $account_id
    }) {
      e_proxy_indicator
      e_statement_indicator
      e_confirm_indicator
      e_prospectus_indicator
      e_tax_statement_indicator
    }
  }
`

export const GET_REQUEST_STATUS = gt`
  query fetch_account_request_status($user_id: String!, $account_id: String!){
    fetch_account_request_status(input: {
      user_id: $user_id,
      account_id: $account_id
    }) {
      account_id
      status
      can_trade
      can_trade_options
      can_fund
      margin_agreement
    }
  }
`

export const FETCH_INDETERMINATE_ACCOUNT = gt`
  query { fetch_indeterminate_accounts {
      user_id
      account_id
      sprout_id
      apex_account_id
      account_status
      user_name
      sprout_name
      user_contact
      user_email
      sketch_investigation_id
      request_time
      status
      sprout_status
    }
  }
`

export const FETCH_INDETERMINATE_ACCOUNT_POST_APEX_MIGRATION = gt`
  query { fetch_indeterminate_accounts_post_apex_migration {
      user_id
      account_id
      sprout_id
      apex_account_id
      account_status
      user_name
      sprout_name
      user_contact
      user_email
      sketch_investigation_id
      request_time
      status
      sprout_status
    }
  }
`

export const FETCH_REJECTED_ACCOUNT = gt`
  query { fetch_rejected_accounts {
      user_id
      account_id
      sprout_id
      apex_account_id
      account_status
      user_name
      sprout_name
      user_contact
      user_email
      sketch_investigation_id
      request_time
      sprout_status
  }
}
`
export const FETCH_REJECTED_ACCOUNT_POST_APEX_MIGRATION = gt`
  query { fetch_rejected_accounts_post_apex_migration {
      user_id
      account_id
      sprout_id
      apex_account_id
      account_status
      user_name
      sprout_name
      user_contact
      user_email
      sketch_investigation_id
      request_time
      sprout_status
  }
}
`
export const UPDATE_DOCUMENT_MATADATA = gt` 
  mutation update_document_metadata($user_id: String!, $key: String!, $tag: [String]){
    update_document_metadata(input:{
      user_id: $user_id,
      key: $key,
      tag: $tag
    }){
      status
    }
  }
`

export const CREATE_INVENTORY_ORDER = gt`
mutation create_inventory_order($side : String!,$symbol : String!,$quantity : Int! ){
  create_inventory_order(input:{
    side: $side,
    symbol:$symbol,
    quantity: $quantity
  }){
    order_id
    owner
    status
    legs{
      leg_id
     symbol
      side
    }
    allocation_type
    quantity
    time_stamp
    fill_simulation
  }
}`

export const COPY_DOCUMENT = gt` 
  mutation copy_document($user_id: String!, $key: String!, $target_sprout_id: String!){
    copy_document(input:{
      user_id: $user_id,
      key: $key,
      target_sprout_id: $target_sprout_id
    }){
      status
    }
  }
`

export const UPDATE_FIRM_AFFILIATION = gt`
  mutation update_firm_affiliation($user_id: String!,$account_id: String!, $affiliated_approval: [String] ) {
    update_firm_affiliation(input:{
      user_id:$user_id,
      account_id:$account_id,
      affiliated_approval:$affiliated_approval
    }){
      status
    }
  }
`

export const FETCH_SOD_STATISTICS = gt` 
query fetch_sod_statistics($from : String!,$to: String!) {
  fetch_sod_statistics(input: {from:$from, to:$to}) {
    date
    reports {
      report_number
      extract_count
    }
  }
}`

export const UPDATE_ACCOUNT = gt`
  mutation update_account($account_id: String!, $user_id: String!, $esigned: String!){
    update_account(input: { 
      account_id: $account_id,
      user_id: $user_id
      esigned: $esigned
    }) {
      account_id
      status
      can_trade
      can_trade_options
      can_fund
      margin_agreement
      customer_type
      options
      trade_authorization
      applicants {
        applicant_id
        applicant_type
        name {
          first
          middle
          last
        }
        email
        birthday
        ssn
        w8_ben_tax_id
        birth_country
        citizenship_country
        mobile
        employment_status
        employer
        address {
          line_1
          city
          line_2
          state
          postal_code
          country
        }
        disclosures {
          political_exposure {
            organization
            family
          }
        }
        beneficiaries {
          beneficiary_id
          beneficiary_type
          name{
            first
            middle
            last
          }
          birthday
          ssn
          relationship
          share_percent
          address {
            line_1
            city
            line_2
            state
            postal_code
            country
          }
        }
        foreign_application {
          nature_of_business
          banks
          estimated_initial_deposit
          activity_type
          expected_withdrawals
        }
        risk_profile {
          time_horizon
          liquidity_needs
          investment_objective
          investment_experience
          risk_tolerance
          annual_income
          liquid_net_worth
          total_net_worth
          num_dependents
          marital_status
        }
      }
      notes {
        note
        timestamp
      }
    }
  }
`

export const FETCH_EMAIL_BOUNCED_USERS = gt`
query {
  fetch_bounced_emails {
    user_id
    user_name
    first_name
    last_name
    phone
    email
    email_verified
}
}
`

export const UPDATE_EMAIL = gt`
mutation update_email($user_id : String! ,$updated_email : String! ,$send_verification_email:Boolean!  ){
  update_email(input: {user_id:$user_id,
    updated_email: $updated_email ,
    send_verification_email: $send_verification_email}) {
    user_id
    updated_email
    is_successfully_updated
    account {
      account_id
      is_updated
    } 
   }
}
`

export const FETCH_EMAIL_UNMATCHED_USERS = gt`
query {
  fetch_unmatched_emails {
    user_id
    user_name
    first_name
    last_name
    phone
    email
    email_verified
  }
}
`
export const UPDATE_INSTRUCTION = gt`mutation update_instruction($user_id : String!,$sprout_id : String!,$goal_id : String!,$transfer_reference_id : String!,$action : String!) {
  update_instruction(input: { user_id: $user_id, 
    sprout_id: $sprout_id, 
    goal_id: $goal_id, 
    transfer_reference_id: $transfer_reference_id, 
    action: $action
  }) {
    transfer_id
    status
  }
}`

export const GET_REWARDS = gt`
  query get_rewards($user_id: String!, $sprout_id: String!){
		get_rewards(input: { user_id: $user_id,
		sprout_id: $sprout_id
		}) {
			user_id
			sprout_id
			goal_id
			reward_id
			goal_name
			external_reference_id
			status
			request_time
			instruction_id     
    }
  }
`
export const FETCH_CHART_PERFORMANCE_DATA = gt`
	query fetch_chart_performance_data($user_id: String!, $sprout_id: String){
		fetch_chart_performance_data(input: {user_id: $user_id, sprout_id: $sprout_id}) {
			performance_data
		}
	}
`
export const FETCH_CHART_PREDICTION_DATA = gt`
	query fetch_chart_prediction_data($user_id: String!, $sprout_id: String){
		fetch_chart_prediction_data(input: {user_id: $user_id,  sprout_id: $sprout_id}) {
			prediction_data
		}
	}
`
export const GET_TAX_DOCUMENTS = gt`
  query detail($user_name: String) {
    detail(input: {detail: {user_name: $user_name, switches: {
      admin: true, 
      broker_dealer: {
        tax_statement: true
      }
    }}}) {
      broker_dealer {
        sprout_id
        account_id
        tax_statement {
          date
          url
          statement_type
          __typename
        }
        __typename
      }
      __typename
    }
  }
`
export const GET_GIFTS = gt`
	query get_gifts($user_id: String!, $gift_id: String!, $gift_receipt_code: String!, $handle: String!) {
		get_gifts(input: {
			user_id: $user_id,
			gift_id: $gift_id,
			gift_receipt_code: $gift_receipt_code,
			handle: $handle
		}) {
			user_id
			gift_id
			gift_receipt_code
			gift_status
			handle
			frequency
			frequency_type
			initial_gift_date
			ip
			next_gift_date
			plaid_account_id
			plaid_public_token
			total
			type
			finance {
				plaid_access_token
				plaid_account_id
				plaid_item_id
				plaid_public_token
				plaid_verification_time
				transactions {
					bank_transfer_id
					individual_transfer_amount
					individual_transfer_creation_time
					individual_transfer_request_time
					individual_transfer_status
				}
			}
			gifter {
				city
				country
				date_of_birth
				email
				first_name
				last_name
				line_1
				line_2
				message
				phone
				post_code
				state
			}
			instructions {
				amount
				frequency
				goal_id
				initial_gift_date
				sprout_id
			}
		}
	}
`

export const FETCH_GIFTS_GIVENBY_USER = gt`
  query fetch_gift($user_type: String!, $user_id: String!, $role: String!) {
    fetch_gift(input:{
      object_type: $user_type
      object_id: $user_id
      role: $role
    }){
        gifting {
          gift_id
          gift_receipt_code
          gift_status
          handle
          timestamp
          object_id
          user_id
          next_gift_date
          gifter_name
          giftee_name
          gift {
            claimant {
              claimed_by
              email
              first_name
              gift_hash
              last_name
              phone
            }
            gift_id
            gift_receipt_code
            gift_status
            frequency
            initial_request_time
            last_updated_time
            type
            user_id
            instruction {
              amount
              frequency
              goal_id
              initial_gift_date
              sprout_id
              user_id
            }
            data {
              ach_type
              frequency
              handle
              initial_gift_date
              ip
              next_gift_date
              object_id
              object_type
              total
            }
          }
        }
    }
  }
`

export const FETCH_OBJECT_DETAILS = gt`
  query FetchDetail($object_id: [String]!) {
    fetch_detail(input: {object_id: $object_id}) {
      output {
        detail {
          date_of_birth
          share_code
          image_url
          object_id
          caption_1
          caption_2
          parent_id
        }
        error
        message
      }
    }
  }
`

export const FETCH_BANK_INFORMATION = gt`
query fetch_bank_information($user_id: String!){
  fetch_bank_information(input: {user_id: $user_id}) {
    bank_information {
      user {
        bank_status
        user_id
        bank_user_id
        bank_node_id
        initial_request_time
        nodes{
          ach_us {
            bank_status
            user_id
            bank_user_id
            bank_node_id
            initial_request_time
            bank_node_type
            node_is_active
            node_supp_id
            node_permission
            node_info {
              bank_hlogo
              bank_code
              address
              type
              account_num
              bank_long_name
              name_on_account
              routing_num
              bank_name
              nickname
              bank_url
              bank_logo
              class
            }
          }
          custody_us {
            bank_status
            user_id
            sprout_id
            bank_user_id
            bank_node_id
            initial_request_time
            bank_node_type
            node_is_active
            node_supp_id
            node_permission
            subnet {
              account_number
              account_type
              bank_subnet_id
              supp_id
              type
              status
            }
          }
        }
      }
    }
  }
}
`

// export const FETCH_GIFT_TRANSACTIONS = gt`
// query fetch_gift_instructions($gift_ids: [String!]!){
//   fetch_gift_instructions(input:{gift_ids: $gift_ids}){
//     gifts {
//       gift_id
//       ach_transfers {
//         bank_transaction_id
//         bank_transfer_id
//         object_id
//         object_type
//         status
//         amount
//         webhook_log_id
//         same_day_settlement
//         transaction_creation_time
//         ip
//         transaction_process_time
//         transaction_request_time
//         transaction_settlement_time
//         type
//         from {
//           type
//           user_id
//           node_id
//         }
//         to {
//           type
//           user_id
//           node_id
//         }
//         fees {
//           id
//           fee
//           note
//         }
//       }
//       instructions {
//         gift_instruction_id
//         user_id
//         sprout_id
//         status
//         bank_balance_check_time
//         goal_id
//         amount
//         investment_request_time
//         frequency
//         transfer_reference_id
//         transactions {
//           individual_transfer_request_time
//           individual_transfer_creation_time
//           individual_transfer_amount
//           individual_transfer_status
//           bank_transfer_id
//           bank_transaction_id
//           object_id
//           object_type
//           bank_transfer_status
//           amount
//           webhook_log_id
//           same_day_settlement
//           transaction_creation_time
//           ip
//           transaction_process_time
//           transaction_request_time
//           transaction_settlement_time
//           type
//           from {
//             type
//             user_id
//             node_id
//           }
//           to {
//             type
//             user_id
//             node_id
//           }
//           fees {
//             id
//             note
//             fee
//           }
//         }
//       }
//     }
//   }
// }
// `

export const FETCH_GIFT_INSTRUCTIONS = gt`
query fetch_gift_transactions($gift_ids: [String!]!){
  fetch_gift_transactions(input:{gift_ids: $gift_ids}){
    gifts {
      gift_id
      ach_transfers {
        bank_transaction_id
        bank_transfer_id
        object_id
        object_type
        bank_transfer_status
        amount
        webhook_log_id
        same_day_settlement
        transaction_creation_time
        ip
        transaction_process_time
        transaction_request_time
        transaction_settlement_time
        type
        fees {
          id
          note
          fee
        }
        to {
          type
          user_id
          node_id
        }
        from {
          type
          user_id
          node_id
        }
        gift_instructions {
          gift_instruction_id
          user_id
          sprout_id
          status
          bank_balance_check_time
          goal_id
          amount
          investment_request_time
          frequency
          transfer_reference_id
          transactions {
            individual_transfer_request_time
            individual_transfer_creation_time
            individual_transfer_amount
            individual_transfer_status
            bank_transfer_id
            bank_transaction_id
            object_id
            object_type
            bank_transfer_status
            amount
            webhook_log_id
            same_day_settlement
            transaction_creation_time
            ip
            transaction_process_time
            transaction_request_time
            transaction_settlement_time
            type
            fees
            to {
              type
              user_id
              node_id
            }
            from {
              type
              user_id
              node_id
            }
          } 
        } 
      }
    }
  }
}
`
export const FETCH_GIFT_MONITORING_STATS = gt`
  query fetch_gift_monitoring_statistics($from: String!, $to: String!){
    fetch_gift_monitoring_statistics(input: 
      {
        from: $from, 
        to: $to
      }) {
      gift {
        handle
        user_id
        gifter_name
        giftee_name
        gift_receipt_code
        timestamp
        object_id
        gift_id
        gift_status
        initial_request_time
        last_updated_time
        plaid_balance_check_time
        type
        frequency
        data {
          next_gift_date
          total
          object_type
          ip
          ach_type
          handle
          frequency_type
          object_id
          initial_gift_date
          frequency
        }
        claimant {
          claimed_by
          email
          first_name
          gift_hash
          last_name
          phone
        }
        finance {
          finance_link_time
          plaid_access_token
          plaid_account_id
          transactions {
            bank_transfer_id
            individual_transfer_amount
            individual_transfer_creation_time
            individual_transfer_request_time
            individual_transfer_status
          }
        }
        instruction {
          amount
          frequency
          goal_id
          goal_name
          initial_gift_date
          portfolio_id
          sprout_id
          user_id
        }
      }
    }
    }
  
`

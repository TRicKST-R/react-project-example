import gt from 'graphql-tag'

export const DELETE_FUNDING_SOURCE = gt`
  mutation delete_funding_source($user_id: String!, $account_id: String!, $source_id: String!, $comment: String!){
    delete_funding_source(input: {
      user_id: $user_id,
      account_id: $account_id,
      source_id: $source_id,
      comment: $comment
    }) {
      message
    }
  }
`

export const UPDATE_ACCOUNT_INVESTMENT = gt`
  mutation update_account(
    $account_id: String!,
    $user_id: String!,
    $agent_name: String!,
    $risk_profile: risk_profile_input
  ){
    update_account(input: {
      account_id: $account_id,
      user_id: $user_id,
      agent_name: $agent_name,
      risk_profile: $risk_profile
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

export const UPDATE_ACCOUNT_SUITABILITY = gt`
  mutation update_account(
    $account_id: String!,
    $user_id: String!,
    $agent_name: String!,
    $risk_profile: risk_profile_input
  ){
    update_account(input: {
      account_id: $account_id,
      user_id: $user_id,
      agent_name: $agent_name,
      risk_profile: $risk_profile
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

export const UPDATE_ACCOUNT_APPLICANT = gt`
  mutation update_account_applicant(
    $account_id: String!,
    $user_id: String!,
    $applicant_id: String!,
    $applicants: [applicant]
  ){
    update_account_applicant(input: {
      account_id: $account_id,
      user_id: $user_id,
      applicant_id: $applicant_id,
      applicants: $applicants
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

export const SEND_SQS_MESSAGE = gt`
  mutation send_sqs_message($user_id: String!, $queue_name: String!, $payload: String!){
    send_sqs_message(input: {
      user_id: $user_id,
      queue_name: $queue_name,
      payload: $payload
    }) {
      message
    }
  }
`
export const CREATE_REWARD = gt`
	mutation create_reward(
		$user_id: String!, 
		$sprout_id: String!,
		$goal_id: String!,
		$amount: String!,	
    $comments: String!,
    $external_reference_id: String!
	) {
		create_reward(input: {
			user_id: $user_id,
			sprout_id: $sprout_id,
			goal_id: $goal_id,
			amount: $amount,
      comments: $comments,
      external_reference_id: $external_reference_id
		}) {
			reward_id
    	status
		}
	}
`

export const CREATE_INSTRUCTION = gt`
	mutation create_instruction(
		$user_id: String!, 
		$sprout_id: String!,
		$goal_id: String!,
		$amount: String!,
		$sub_type: String!,
		$comments: String!
	) {
		create_instruction(input: {
			user_id: $user_id,
			sprout_id: $sprout_id,
			goal_id: $goal_id,
			amount: $amount,
			sub_type: $sub_type,
			comments: $comments
		}) {
			transfer_id
    	status
		}
	}
`

export const UPLOAD_DOCUMENT = gt`
	mutation upload_document($user_id: String!, $sprout_id: String!, $document_type: String!, $tag: String!, $file: Upload!, $bit: String!) {
		upload_document(input: {
			user_id: $user_id,
			sprout_id: $sprout_id
			document_type: $document_type,
			tag: $tag,
			file: $file,
			bit: $bit
		}) {
			status
			key
		}
	}
`
export const CREATE_INDIVIDUAL_ACCOUNT = gt`
	mutation create_individual_account($user_id: String!) {
		create_individual_account(input: {
			user_id: $user_id
		}) {
			account_id
			status
		}
	}
`

export const CREATE_CHILD_AMOUNT = gt`
	mutation create_child_amount($user_id: String!, $first_name: String!, $last_name: String!, $birthday: String!, $sprout_id: String!, $parent_ssn: String!, $child_ssn: String!) {
		create_child_amount(input: {
			user_id: $user_id,
			first_name: $first_name,
			last_name: $last_name,
			birthday: $birthday,
			sprout_id: $sprout_id,
			parent_ssn: $parent_ssn,
			child_ssn: $child_ssn
		}) {
			account_id
			status
		}
	}
`

export const UPDATE_FUNDING_BANK_STATUS = gt`
	mutation update_funding_bank_status($user_id: String!, $source_reference_id: String!, $bank_status: String!) {
		update_funding_bank_status(input: {
			user_id: $user_id,
			source_reference_id: $source_reference_id,
			bank_status: $bank_status
		}) {
			user_id
      source_reference_id
      bank_status
      is_successfully_updated
		}
	}
`

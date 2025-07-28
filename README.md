# AI Dev Team

An LLM agent-based development setup that works together as a regular software development, operations or devops team (depending on the need)

The team has different agents for different roles:

A application dev team (business stream aligned team) might be composed of:

- product manager x1
- UX designer x1
- lead engineer x1
- frontend engineer x2
- backend engineer x2
- database expert (a subtype of the backend engineer) x1

A platform team might be composed of

- product manager x1
- lead platform engineer x1
- devops automation engineer
- CI expert (a subtype of the devops automation engineer) x2
- CD expert (a subtype of the devops automation engineer) x2
- security engineer x1
- infrastructure operator x1

An infrastructure team might be composed of

- product manager x1
- lead cloud engineer x1
- cloud engineer x2
- cloud security engineer x1

## Concepts

- **Project** is the top level configuration layer. Every item either directly or indirectly belongs to a project.
- **Application** is a collection of one or more services that together offer an end to end exerience to its users and create value for the business.
- **Service** a part of an application that can be run and deployed separately from the other services composing an application. A service offers clear interfaces to its users either in the form of a GUI or APIs.
- **Team** a collection of agents where every agent has a specific role
- **Workflows** a definition of use cases that the project supports. Every use case has a well defined deliverable that is either in the form of a deployed service that improves a new or existing application or it's an input to another use case. In the end, every such flow of use cases needs to end in a deployes service that improves a new or existing application. Every use case has an initial input, and might reach out (ask for) input during its flow. The input might be a human input or migth be the output of another workflow. A workflow consists of steps, potential loops, waiting steps when they laung external workflows, etc. For example, a possible series of workflows could be: Feature discovery worfklow -> Feature refinement workflow -> Issue breakdown workflow -> Issue planning workflows -> Issue delivery workflow -> Acceptance testing workflow -> Service deployment workflow.
- **Agent** an LLM-based solution with specific context to act accordingly to a given role. Every role-service combination maintains their own learnings from every workflow. These learnings enhance their context.

## Stack

- The project uses Python
- https://github.com/the-pocket/PocketFlow is used for LLM-based workflow orchestration
- SQLite is used extensively for shared store and agent-instance specific memory as needed
- CLaude Code (either as a subprocess or its python SDK) is used as the primary LLM backend (https://docs.anthropic.com/en/docs/claude-code/sdk)
- The agents are coded as Claude Code Sub-agents (https://docs.anthropic.com/en/docs/claude-code/sub-agents)

## Remote dev setup

```
# set OP_SERVICE_ACCOUNT_TOKEN to the 1password service account token from respective vault
export OP_SERVICE_ACCOUNT_TOKEN=

# download .env file
op document get dotEnv --vault=devpod@rackspace-spot-ai-codespace-us -o .envrc.local
```

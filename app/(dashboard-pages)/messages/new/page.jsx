import NewConversationForm from "../components/new-conversation";

export default function NewConversationPage({ searchParams = {} }) {
  return <NewConversationForm {...{ searchParams }} />;
}

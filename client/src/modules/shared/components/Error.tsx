interface ErrorProps {
  message: string | undefined;
}

const Error = ({ message }: ErrorProps) => {
  return <p className="text-sm text-red-500">{message}</p>;
};

export default Error;

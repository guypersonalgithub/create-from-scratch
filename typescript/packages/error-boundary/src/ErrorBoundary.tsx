import { type ReactNode, type ErrorInfo, Component } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackRender?: (error: Error, info: ErrorInfo) => ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error("Error caught in boundary:", error, errorInfo);
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, fallbackRender } = this.props;

    if (hasError && error) {
      if (fallbackRender) {
        return fallbackRender(error, errorInfo!);
      }
      if (fallback) {
        return fallback;
      }

      return (
        <div style={{ color: "red", padding: "1rem" }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {error.toString()}
            <br />
            {errorInfo?.componentStack}
          </details>
        </div>
      );
    }

    return children;
  }
}

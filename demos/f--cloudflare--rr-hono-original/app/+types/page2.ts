export interface MetaArgs {}

export interface ComponentProps {
  loaderData: {
    message: string;
  };
}

export type Route = {
  MetaArgs: MetaArgs;
  ComponentProps: ComponentProps;
};

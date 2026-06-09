import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FormBuilderHero = ({
  // eslint-disable-next-line no-unused-vars
  illustrationSrc,
  // eslint-disable-next-line no-unused-vars
  illustrationAlt,
  title,
  description,
  buttonText,
  buttonHref = "#",
  onButtonClick,
}) => {
  return (
    <div className="flex w-full items-center justify-center px-4 py-6 md:py-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          {title}
        </h1>

        <p className="mb-8 max-w-lg text-base md:text-lg text-muted-foreground">
          {description}
        </p>

        <Button asChild size="lg" onClick={onButtonClick}>
          <a href={buttonHref}>
            {buttonText}
            <ArrowRight className="ml-2 size-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};

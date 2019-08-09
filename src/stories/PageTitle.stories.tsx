import React from "react";
import { storiesOf } from "@storybook/react";
import { withWrapper } from "./helpers";
import PageTitle from "../components/core/PageTitle";
import { withKnobs, text, boolean } from "@storybook/addon-knobs";

storiesOf("Page Title", module)
  .addDecorator(withKnobs)
  .addDecorator(withWrapper)
  .add("Default", () => (
    <PageTitle placeholder={boolean("Placeholder", false)}>
      {text("Content", "Page Title")}
    </PageTitle>
  ));

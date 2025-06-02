export interface BaseFieldProps {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

export interface TextFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "url" | "tel";
  maxLength?: number;
  minLength?: number;
}

export interface TextAreaFieldProps extends BaseFieldProps {
  rows?: number;
  maxLength?: number;
  resize?: boolean;
}

export interface SelectFieldProps extends BaseFieldProps {
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  searchable?: boolean;
}

export interface LocationFieldProps extends BaseFieldProps {
  value: {
    city: string;
    country: string;
    timezone: string;
  };
}

export interface LanguageFieldProps extends BaseFieldProps {
  value: Array<{
    name: string;
    level: string;
  }>;
}

export interface TagFieldProps extends BaseFieldProps {
  value: string[];
  suggestions?: string[];
  maxTags?: number;
}

export interface SocialLinkFieldProps extends BaseFieldProps {
  value: Array<{
    platform: string;
    url: string;
    handle: string;
  }>;
  supportedPlatforms: Array<{
    name: string;
    icon: string;
    urlPattern: string;
  }>;
}

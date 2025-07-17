import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StacksNetwork } from "@stacks/network";

// Form validation schema
export const tokenFormSchema = z.object({
  name: z
    .string()
    .min(1, "Token name is required")
    .max(116, "Token name must be less than 116 characters")
    .regex(
      /^[a-zA-Z0-9 ]+$/,
      "Only alphanumeric characters and spaces allowed"
    ),

  ticker: z
    .string()
    .min(1, "Ticker is required")
    .max(10, "Ticker must be less than 10 characters")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9]*$/,
      "Ticker must start with a letter and can only contain letters and numbers"
    )
    .transform((val) => val.toUpperCase()), // Convert to uppercase after validation

  supply: z
    .number({
      required_error: "Supply is required",
      invalid_type_error: "Supply must be a number",
    })
    .min(1000000, "Supply must be at least 1M")
    .max(1000000000, "Supply cannot exceed 1B"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(1400, "Description must be less than 1400 characters"),

  logo: z
    .custom<File>((file) => file instanceof File, {
      message: "Image is required",
    })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File must be less than 10MB"
    )
    .refine(
      (file) =>
        [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/svg+xml",
          "image/gif",
          "video/mp4",
          "video/quicktime",
        ].includes(file.type),
      "Only JPEG, PNG, SVG, WebP, or MP4 files are allowed"
    ),

  targetSTX: z
    .number()
    .min(2000, "Target STX must be at least 2000") // 2000 testing fix back tesnet mainnet
    .max(30000, "Target STX must be less than 30000")
    .transform((val) => (Number.isNaN(val) ? 6000 : val)),

  initialBuyAmount: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return 0;
      const num = parseFloat(val);
      if (isNaN(num)) throw new Error("Invalid number");
      return num;
    })
    .refine((val) => val >= 0, "Initial buy must be >= 0"),

  // Optional social fields
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  telegram: z.string().url("Invalid URL").optional().or(z.literal("")),
  discord: z.string().url("Invalid URL").optional().or(z.literal("")),

  tokenToDex: z.string().optional(),
  tokenToDeployer: z.string().optional(),
  stxToDex: z.number().optional(),
  stxBuyFirstFee: z.number().optional(),

  targetAmm: z.string(),
});

export interface TokenFormData extends z.infer<typeof tokenFormSchema> {
  tokenToDex?: string;
  tokenToDeployer?: string;
  stxToDex?: number;
  stxBuyFirstFee?: number;
  targetAmm: string;
}

const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      resolve({ width: 200, height: 200 }); // Default for videos
      return;
    }

    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });
};

// Storage helper functions
const uploadToStorage = async (file: File): Promise<string> => {
  // TODO: Implement your storage upload logic (IPFS, S3, etc.)
  // Example:
  // const formData = new FormData();
  // formData.append("file", file);
  // const response = await fetch("/api/upload", {
  //   method: "POST",
  //   body: formData,
  // });
  // return response.json().then(data => data.url);
  return "ipfs://example";
};

const uploadMetadata = async (metadata: any): Promise<string> => {
  // TODO: Implement your metadata upload logic
  // Example:
  // const response = await fetch("/api/metadata", {
  //   method: "POST",
  //   body: JSON.stringify(metadata),
  // });
  // return response.json().then(data => data.uri);
  return "ipfs://metadata";
};

const saveTokenMetadata = async (metadata: any): Promise<void> => {
  // TODO: Implement your database save logic
  // Example:
  // await fetch("/api/tokens", {
  //   method: "POST",
  //   body: JSON.stringify(metadata),
  // });
};

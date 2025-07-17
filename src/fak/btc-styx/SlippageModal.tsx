import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SlippageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlippage: number;
  onSlippageChange: (value: number) => void;
}

const SlippageModal: React.FC<SlippageModalProps> = ({
  isOpen,
  onClose,
  currentSlippage,
  onSlippageChange,
}) => {
  const queryClient = useQueryClient();

  // React Query for persistence
  const { data: savedSlippage } = useQuery({
    queryKey: ["slippage"],
    queryFn: () => localStorage.getItem("slippage") || "15",
    initialData: "0.5",
  });

  const updateSlippage = useMutation({
    mutationFn: (newSlippage: number) => {
      localStorage.setItem("slippage", newSlippage.toString());
      return Promise.resolve(newSlippage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slippage"] });
    },
  });

  const handleSlippageChange = (value: number) => {
    onSlippageChange(value);
    updateSlippage.mutate(value);
  };

  const presetValues = [15, 25, 100];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.800" p={4}>
        {/* <ModalHeader color="white">Configure Slippage</ModalHeader> */}
        <ModalCloseButton color="gray.400" />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            <HStack spacing={2}>
              {presetValues.map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant="outline"
                  borderColor="gray.600"
                  color="gray.400"
                  onClick={() => handleSlippageChange(value)}
                  bg={currentSlippage === value ? "gray.700" : "transparent"}
                  _hover={{ bg: "gray.700" }}
                >
                  {value}%
                </Button>
              ))}
            </HStack>

            <VStack spacing={2} align="stretch">
              <Text color="gray.400" fontSize="sm">
                Custom Slippage
              </Text>
              <Slider
                value={currentSlippage}
                min={1}
                max={100}
                step={1}
                onChange={handleSlippageChange}
              >
                <SliderTrack>
                  <SliderFilledTrack bg="green.300" />
                </SliderTrack>
                <SliderThumb boxSize={4} />
              </Slider>
              <Text color="gray.400" fontSize="sm" textAlign="right">
                {currentSlippage}%
              </Text>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SlippageModal;

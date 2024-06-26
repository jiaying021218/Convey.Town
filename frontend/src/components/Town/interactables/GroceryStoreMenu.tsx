import GroceryStoreAreaController from '../../../classes/interactable/GroceryStoreAreaController';
import { useInteractable, useInteractableAreaController } from '../../../classes/TownController';
import { GroceryItem, InteractableID } from '../../../types/CoveyTownSocket';
import { useCallback, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import GroceryStoreAreaInteractable from './GroceryStoreArea';
import useTownController from '../../../hooks/useTownController';
import React from 'react';
import AppleIcon from './icons/AppleIcon';
import BaconIcon from './icons/BaconIcon';
import BananaIcon from './icons/BananaIcon';
import BreadIcon from './icons/BreadIcon';
import CarrotIcon from './icons/CarrotIcon';
import DonutIcon from './icons/DonutIcon';
import EggIcon from './icons/EggIcon';
import FishIcon from './icons/FishIcon';
import PizzaIcon from './icons/PizzaIcon';
import NoIcon from './icons/NoIcon';

/**
 * A component that renders a grocery store area.
 *
 * It uses Chakra-UI components (does not use other GUI widgets)
 *
 * It uses the GroceryStoreController corresponding to the provided interactableID to get the current state of the groceryStore. (@see useInteractableAreaController)
 *
 * It renders the following:
 *  - A list of items in the store inventory that allow adding item to cart
 *  - The purchase history that displays the purchases made by the player
 *  - The cart that allows returning items and checking out
 *  - The total price of the cart and the player's balance
 *  - A checkout button that allows the player to checkout with error checking that does not allow the player to checkout if they have insufficient funds
 */
export function GroceryMenu({ interactableID }: { interactableID: InteractableID }): JSX.Element {
  const iconMap: { [key: string]: React.ComponentType } = {
    apple: AppleIcon,
    bacon: BaconIcon,
    banana: BananaIcon,
    pizza: PizzaIcon,
    bread: BreadIcon,
    carrot: CarrotIcon,
    donut: DonutIcon,
    fish: FishIcon,
    egg: EggIcon,
  };
  const groceryStoreAreaController =
    useInteractableAreaController<GroceryStoreAreaController>(interactableID);
  const [storeInventory, setStoreInventory] = useState<GroceryItem[] | null>(
    groceryStoreAreaController.storeInventory,
  );
  const [storeCart, setStoreCart] = useState<GroceryItem[] | null>(groceryStoreAreaController.cart);
  const [totalPrice, setTotalPrice] = useState<number>(groceryStoreAreaController.totalPrice);
  const [playerBalance, setPlayerBalance] = useState<number>(groceryStoreAreaController.balance);
  const [history, setHistory] = useState<GroceryItem[]>(groceryStoreAreaController.history);
  const toast = useToast();

  const handleRemoveItem = async (itemName: string) => {
    await groceryStoreAreaController.handleRemoveItem(itemName);
  };

  const handleAddItem = async (itemName: string, price: number) => {
    await groceryStoreAreaController.handleAddItem(itemName, price);
  };

  useEffect(() => {
    const updateGroceryStoreAreaModel = () => {
      setStoreInventory(groceryStoreAreaController.storeInventory);
      setStoreCart(groceryStoreAreaController.cart);
      setTotalPrice(groceryStoreAreaController.totalPrice);
      setPlayerBalance(groceryStoreAreaController.balance);
      setHistory(groceryStoreAreaController.history);
    };
    groceryStoreAreaController.addListener('groceryStoreAreaUpdated', updateGroceryStoreAreaModel);

    return () => {
      groceryStoreAreaController.removeListener(
        'groceryStoreAreaUpdated',
        updateGroceryStoreAreaModel,
      );
    };
  }, [
    groceryStoreAreaController,
    storeCart,
    totalPrice,
    storeInventory,
    playerBalance,
    toast,
    history,
  ]);

  return (
    <Container className='GroceryStoreMenu'>
      <Container>
        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                Want to look at your last purchase?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <Table variant='striped' colorScheme='yellow'>
                <Thead>
                  <Tr>
                    <Th>Item Name</Th>
                    <Th></Th>
                    <Th>Price</Th>
                    <Th>Quantity</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {history.map((item: GroceryItem) => (
                    <Tr key={item.name}>
                      <Td>{item.name}</Td>
                      <Td>
                        {iconMap[item.name] ? React.createElement(iconMap[item.name]) : <NoIcon />}
                      </Td>
                      <Td>{item.price}</Td>
                      <Td>{item.quantity}</Td>
                      <Td></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Container>
      {storeInventory && (
        <Container>
          <Heading as='h3'>Grocery Store</Heading>
          <Table variant='striped' colorScheme='yellow'>
            <Thead>
              <Tr>
                <Th>Item Name</Th>
                <Th></Th>
                <Th>Price</Th>
                <Th>Quantity</Th>
              </Tr>
            </Thead>
            <Tbody>
              {storeInventory
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item: GroceryItem) => (
                  <Tr key={item.name}>
                    <Td>{item.name}</Td>
                    <Td>
                      {iconMap[item.name] ? React.createElement(iconMap[item.name]) : <NoIcon />}
                    </Td>
                    <Td>{item.price}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>
                      <Button
                        onClick={async () => {
                          try {
                            await handleAddItem(item.name, item.price);
                          } catch (err) {
                            toast({
                              title: 'Error adding item',
                              description: (err as Error).toString(),
                              status: 'error',
                            });
                          }
                        }}>
                        Add
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Container>
      )}
      <Container>
        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                Check out here!
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {storeCart && (
                <Container>
                  <Heading as='h4'>Cart</Heading>
                  <Table variant='striped' colorScheme='yellow'>
                    <Thead>
                      <Tr>
                        <Th>Item Name</Th>
                        <Th>Price</Th>
                        <Th>Quantity</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {storeCart
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((item: GroceryItem) => (
                          <Tr key={item.name}>
                            <Td>{item.name}</Td>
                            <Td>{item.price}</Td>
                            <Td>{item.quantity}</Td>
                            <Td>
                              <Button onClick={() => handleRemoveItem(item.name)}>Return</Button>
                            </Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </Container>
              )}
              <Box display='flex' justifyContent='space-between' alignItems='center' mt={4}>
                <Box>
                  <p>Total Price: {totalPrice}</p>
                  <p>Your Balance: {playerBalance}</p>
                </Box>
                <Button
                  colorScheme='green'
                  variant='solid'
                  size='md'
                  borderRadius='md'
                  onClick={async () => {
                    if (playerBalance < totalPrice || totalPrice === 0) {
                      toast({
                        title: 'Error checking out',
                        description: 'Insufficient funds',
                        status: 'error',
                      });
                      return;
                    } else {
                      await groceryStoreAreaController.handleCheckout();
                      toast({
                        title: 'Nice work checking out',
                        description: 'Congratz on new items',
                        status: 'success',
                      });
                    }
                  }}>
                  Checkout
                </Button>
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Container>
    </Container>
  );
}

/**
 * A wrapper component for the GroceryMenu components.
 * Determines if the player is currently in a grocerystore area on the map, and if so,
 * renders the grocery menu component in a modal.
 *
 */
export default function GroceryStoreAreaWrapper(): JSX.Element {
  const groceryStoreArea = useInteractable<GroceryStoreAreaInteractable>('groceryStoreArea');
  const townController = useTownController();
  let controller;
  if (groceryStoreArea) {
    controller = townController.getGroceryStoreAreaController(groceryStoreArea);
  }
  const closeModal = useCallback(() => {
    if (groceryStoreArea) {
      townController.interactEnd(groceryStoreArea);
    }
  }, [townController, groceryStoreArea]);

  useEffect(() => {
    if (groceryStoreArea) {
      townController.pause();
    } else {
      townController.unPause();
    }
  }, [townController, groceryStoreArea]);

  if (groceryStoreArea) {
    controller?.handleOpenGroceryStore();
    return (
      <Modal
        isOpen={true}
        onClose={() => {
          closeModal();
          townController.unPause();
        }}
        closeOnOverlayClick={false}
        size='xl'>
        <ModalOverlay />
        <ModalContent minWidth='fit-content' minHeight='fit-content'>
          <ModalHeader>{groceryStoreArea.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflow='auto'>
            <GroceryMenu interactableID={groceryStoreArea.id} />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return <></>;
}

import { useCallback, useEffect, useState } from 'react';
import { useInteractable, useInteractableAreaController } from '../../../classes/TownController';
import TradingAreaController from '../../../classes/interactable/TradingAreaController';
import { InteractableID } from '../../../types/CoveyTownSocket';
import useTownController from '../../../hooks/useTownController';
import TradingAreaInteractable from './TradingArea';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { TradingArea as TradingAreaModel } from '../../../types/CoveyTownSocket';
import { supabase } from '../../../supabaseClient';
import { set } from 'lodash';

type tradingRows = {
  id: string;
  name: string;
  item: string;
  quantity: number;
};

export function TradingBoard({ interactableID }: { interactableID: InteractableID }): JSX.Element {
  const [items, setItems] = useState<any[] | null>([]);
  const [dbError, setdbError] = useState<string | null>(null);

  const tradingAreaController =
    useInteractableAreaController<TradingAreaController>(interactableID);

  const [TradingAreaModel, setTradingAreaModel] = useState<TradingAreaModel>(
    tradingAreaController.toInteractableAreaModel(),
  );

  useEffect(() => {
    const updateInventoryAreaModel = () => {
      setTradingAreaModel(tradingAreaController.toInteractableAreaModel());
    };
    tradingAreaController.addListener('tradingAreaUpdated', updateInventoryAreaModel);

    let isMounted = true;
    const fetchStoreInventory = async () => {
      const { data, error } = await supabase.from('tradingBoard').select();
      if (isMounted) {
        if (data) {
          setItems(data);
          setdbError(null);
        }
        if (error) {
          setdbError(error.message);
        }
      }
    };

    fetchStoreInventory();
    return () => {
      isMounted = false;
      tradingAreaController.removeListener('tradingAreaUpdated', updateInventoryAreaModel);
    };
  }, []);

  return (
    <div className='TradingBoard'>
      <h1>Trading Board</h1>
      {items && (
        <div>
      <table>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Item</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
            {items
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item: any) => (
                  <tr key={item.playerName}>
                    <td>{item.playerName}</td>
                    <td>{item.item}</td>
                    <td>{item.quantity}</td>
                  </tr>
            ))}
        </tbody>
      </table>
      </div>
      )}
    </div>
  );
}

export default function TradingAreaWrapper(): JSX.Element {
  const tradingArea = useInteractable<TradingAreaInteractable>('tradingArea');
  const townController = useTownController();
  const closeModal = useCallback(() => {
    if (tradingArea) {
      townController.interactEnd(tradingArea);
    }
  }, [townController, tradingArea]);

  useEffect(() => {
    if (tradingArea) {
      townController.pause();
    } else {
      townController.unPause();
    }
  }, [townController, tradingArea]);

  if (tradingArea) {
    return (
      <Modal
        isOpen={true}
        onClose={() => {
          closeModal();
          townController.unPause();
        }}
        closeOnOverlayClick={false}
        size='xl'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{tradingArea.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TradingBoard interactableID={tradingArea.id} />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return <></>;
}

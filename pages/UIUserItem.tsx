import type { NextPage } from 'next';
import Image from 'next/image';
import _ from 'lodash';

interface UIUserItemProps {
  itemId: string;
}

const UIUserItem: NextPage<UIUserItemProps> = (props) => {

  const url = `https://kluest.com/pics/${props.itemId}.jpg`;
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <Image className="border m-1" src={url} alt="Not found" width="100" height="100" />
    </a>
  );
};

export default UIUserItem;

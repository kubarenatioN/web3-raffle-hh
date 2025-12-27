import { formatAddress } from '@/shared/utils/address';
import { styled } from '@/stitches.config';

const Wrapper = styled('span', {
  fontFamily: 'monospace',
  fontSize: 14,
});

function AddressCmp({ children }: { children: string }) {
  return <Wrapper>{formatAddress(children)}</Wrapper>;
}

const Address = styled(AddressCmp, {});

export default Address;
